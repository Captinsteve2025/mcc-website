import { createClient } from "@supabase/supabase-js";
import { CyaApiError, getOperatingAreasRaw, getYachtDetail, normalizeOperatingAreas } from "@/lib/cya";
import { collectRawMenuImageRefs, parseCrewGeneral, parseCrewWithTrace, parseMenus } from "@/lib/yacht-detail";
import { getYachtAvailability } from "@/lib/yacht-content";
import { getBrowserVerification, type BrowserTestResultRow, type YachtBrowserVerification } from "@/lib/browser-tests";

// Server-side production health monitor. Every check reports exactly what it
// observed — nothing is fabricated. Verdicts distinguish "CYA supplies no data"
// from "the parser failed to recognize data CYA supplies", and no server-side
// check is ever labelled fully browser-verified. Supabase-backed storage
// archives each run so regressions against the previous run are flagged.

export type HealthStatus = "healthy" | "warning" | "failed" | "not_tested";

/**
 * How far the observation reaches:
 * - source-missing: CYA genuinely supplies no data; the absence is correct.
 * - parser-mapping-failure: CYA supplies content the site fails to deliver.
 * - delivered-not-browser-verified: the server delivers the content; rendering
 *   in a real browser has not been observed by this check.
 * - fully-verified: content observed rendered end to end (reserved for manual
 *   browser verification; the automated monitor never claims it).
 */
export type VerificationLevel =
  | "source-missing"
  | "parser-mapping-failure"
  | "delivered-not-browser-verified"
  | "fully-verified";

export const VERIFICATION_LABELS: Record<VerificationLevel, string> = {
  "source-missing": "Source data missing",
  "parser-mapping-failure": "Parser mapping failure",
  "delivered-not-browser-verified": "Delivered, not browser-verified",
  "fully-verified": "Fully verified in production",
};

export type YachtCheckItem = {
  yachtId: string;
  yachtName: string | null;
  status: HealthStatus;
  verification: VerificationLevel;
  evidence: string[];
};

export type HealthCheck = {
  id: string;
  title: string;
  status: HealthStatus;
  verification: VerificationLevel;
  summary: string;
  evidence: string[];
  yachts: YachtCheckItem[];
};

export type DeploymentMetadata = {
  commitSha: string | null;
  environment: string | null;
  buildTimestamp: string | null;
  source: string;
};

export type StorageReport = {
  stored: boolean;
  previousRunAt: string | null;
  regressions: string[];
  note: string | null;
  missingConfiguration: string | null;
};

export type SiteHealthReport = {
  ranAt: string;
  overall: HealthStatus;
  checks: HealthCheck[];
  metadata: DeploymentMetadata;
  storage: StorageReport;
  configuration: Array<{ variable: string; present: boolean; usedBy: string }>;
  browser: {
    yachts: Record<string, YachtBrowserVerification>;
    note: string;
  };
};

export const PRIMARY_YACHT_ID = "69f33df0b5a1600bf785869e"; // ENDLESS HORIZON

function worstStatus(statuses: HealthStatus[]): HealthStatus {
  if (statuses.includes("failed")) return "failed";
  if (statuses.includes("warning")) return "warning";
  if (statuses.includes("not_tested")) return "not_tested";
  return "healthy";
}

function worstVerification(levels: VerificationLevel[]): VerificationLevel {
  const order: VerificationLevel[] = ["fully-verified", "delivered-not-browser-verified", "source-missing", "parser-mapping-failure"];
  for (const level of order) {
    if (levels.includes(level)) return level;
  }
  return "delivered-not-browser-verified";
}

function cyaErrorDetail(err: unknown): string {
  if (err instanceof CyaApiError) return `HTTP ${err.status}${err.code ? ` (${err.code})` : ""}`;
  return err instanceof Error ? err.message.slice(0, 200) : "Network or unexpected error";
}

async function fetchDetail(
  yachtId: string
): Promise<{ detail: Record<string, unknown> | null; error: string | null; name: string | null }> {
  try {
    const detail = await getYachtDetail(yachtId);
    return { detail, error: null, name: typeof detail.yachtName === "string" ? detail.yachtName : null };
  } catch (err) {
    return { detail: null, error: cyaErrorDetail(err), name: null };
  }
}

async function checkCyaConnection(): Promise<HealthCheck> {
  const started = Date.now();
  try {
    const raw = await getOperatingAreasRaw();
    const areas = normalizeOperatingAreas(raw);
    const count = areas?.areas.length ?? null;
    const evidence = [
      `Operating-areas endpoint responded in ${Date.now() - started} ms.`,
      count !== null ? `${count} cruising areas returned.` : "Response received but no cruising-area array was recognized.",
    ];
    return {
      id: "cya-connection",
      title: "CYA API connection",
      status: count !== null && count > 0 ? "healthy" : "warning",
      verification: "delivered-not-browser-verified",
      summary:
        count !== null && count > 0
          ? "CYA API is reachable and returning cruising areas."
          : "CYA API responded, but no cruising areas were recognized in the response.",
      evidence,
      yachts: [],
    };
  } catch (err) {
    return {
      id: "cya-connection",
      title: "CYA API connection",
      status: "failed",
      verification: "delivered-not-browser-verified",
      summary: "CYA API request failed.",
      evidence: [`Error after ${Date.now() - started} ms: ${cyaErrorDetail(err)}`],
      yachts: [],
    };
  }
}

function checkCatalogue(
  results: Array<{ yachtId: string; detail: Record<string, unknown> | null; error: string | null; name: string | null }>
): HealthCheck {
  const yachts: YachtCheckItem[] = results.map((r) => {
    if (r.error || !r.detail) {
      return {
        yachtId: r.yachtId,
        yachtName: null,
        status: "failed",
        verification: "delivered-not-browser-verified",
        evidence: [`Detail request failed: ${r.error ?? "unknown error"}`],
      };
    }
    if (r.name) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "healthy",
        verification: "delivered-not-browser-verified",
        evidence: ["Detail record returned with a yacht name.", `${Object.keys(r.detail).length} top-level fields.`],
      };
    }
    return {
      yachtId: r.yachtId,
      yachtName: null,
      status: "warning",
      verification: "source-missing",
      evidence: ["Detail record returned but no yachtName field was found in it."],
    };
  });
  return {
    id: "catalogue",
    title: "Yacht catalogue",
    status: worstStatus(yachts.map((y) => y.status)),
    verification: worstVerification(yachts.map((y) => y.verification)),
    summary:
      yachts.every((y) => y.status === "healthy")
        ? "Every sampled yacht's CYA detail record is reachable."
        : "One or more sampled yachts could not be fetched from CYA.",
    evidence: [`${results.length} yacht(s) sampled.`],
    yachts,
  };
}

// Reports the raw crewGeneral field names so unrecognized content under
// unmapped keys is visible instead of silently dropped.
function rawCrewGeneralContent(detail: Record<string, unknown>): Array<{ key: string; kind: string; preview: string | null }> {
  const raw = detail.crewGeneral;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  return Object.entries(raw as Record<string, unknown>)
    .map(([key, value]) => ({
      key,
      kind: Array.isArray(value) ? "array" : typeof value,
      preview:
        typeof value === "string" && value.trim().length > 0
          ? `${value.trim().slice(0, 80)}${value.trim().length > 80 ? "…" : ""}`
          : null,
    }))
    .filter((f) => f.kind !== "null");
}

function checkCrew(
  results: Array<{ yachtId: string; detail: Record<string, unknown> | null; error: string | null; name: string | null }>
): HealthCheck {
  const yachts: YachtCheckItem[] = results.map((r) => {
    if (r.error || !r.detail) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "not_tested",
        verification: "delivered-not-browser-verified",
        evidence: ["Skipped: the detail record could not be fetched."],
      };
    }
    const trace = parseCrewWithTrace(r.detail);
    const general = parseCrewGeneral(r.detail);
    const rawGeneral = rawCrewGeneralContent(r.detail);

    if (trace.members.length === 0) {
      if (trace.crewShapedTopLevelKeys.length > 0) {
        return {
          yachtId: r.yachtId,
          yachtName: r.name,
          status: "failed",
          verification: "parser-mapping-failure",
          evidence: [
            "Crew-shaped data exists in the CYA record but the parser recognizes none of it — a parser defect, not missing data.",
            `Unrecognized fields: ${trace.crewShapedTopLevelKeys.map((f) => f.key).join(", ")}.`,
          ],
        };
      }
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "warning",
        verification: "source-missing",
        evidence: ["CYA supplies no crew fields for this yacht — the section is hidden because there is genuinely no data."],
      };
    }

    const evidence = [
      `${trace.members.length} crew profile(s) parsed from CYA.`,
      `Fields read: ${trace.matchedCollectionKeys.join(", ")}.`,
      general ? "General crew description mapped and delivered." : "No general crew description delivered.",
    ];

    // The crewGeneral record exists but the parser produced no description:
    // report exactly which fields it holds so a mapping gap is visible.
    if (!general) {
      const unrecognizedContent = rawGeneral.filter(
        (f) => !["crewImage", "crewDescription", "description", "about"].includes(f.key) && (f.preview !== null || f.kind === "object" || f.kind === "array")
      );
      if (rawGeneral.length === 0) {
        return {
          yachtId: r.yachtId,
          yachtName: r.name,
          status: "healthy",
          verification: "source-missing",
          evidence: [...evidence, "CYA's crewGeneral record is absent or empty — nothing is omitted; CYA genuinely supplies no general description."],
        };
      }
      if (unrecognizedContent.length > 0) {
        return {
          yachtId: r.yachtId,
          yachtName: r.name,
          status: "warning",
          verification: "parser-mapping-failure",
          evidence: [
            ...evidence,
            `crewGeneral carries content under field names the parser does not map: ${unrecognizedContent.map((f) => `${f.key} (${f.kind})`).join(", ")}.`,
            ...unrecognizedContent.filter((f) => f.preview !== null).map((f) => `${f.key}: "${f.preview}"`),
          ],
        };
      }
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "healthy",
        verification: "source-missing",
        evidence: [...evidence, `crewGeneral holds only: ${rawGeneral.map((f) => f.key).join(", ")} — no description text is supplied.`],
      };
    }

    return {
      yachtId: r.yachtId,
      yachtName: r.name,
      status: "healthy",
      verification: "delivered-not-browser-verified",
      evidence,
    };
  });
  return {
    id: "crew",
    title: "Crew profiles",
    status: worstStatus(yachts.map((y) => y.status)),
    verification: worstVerification(yachts.map((y) => y.verification)),
    summary:
      yachts.some((y) => y.status === "failed")
        ? "Crew data exists in CYA but the parser is not recognizing it."
        : yachts.every((y) => y.status === "healthy")
          ? "Crew profiles parsed and delivered for every sampled yacht."
          : "Crew profiles checked; see per-yacht evidence.",
    evidence: [],
    yachts,
  };
}

async function checkDining(
  results: Array<{ yachtId: string; detail: Record<string, unknown> | null; error: string | null; name: string | null }>
): Promise<HealthCheck> {
  const yachts: YachtCheckItem[] = await Promise.all(
    results.map(async (r) => {
    if (r.error || !r.detail) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "not_tested",
        verification: "delivered-not-browser-verified",
        evidence: ["Skipped: the detail record could not be fetched."],
      };
    }
    const menus = parseMenus(r.detail);
    const rawImageRefs = collectRawMenuImageRefs(r.detail);
    const urlRefs = rawImageRefs.filter((ref) => ref.url !== null);
    const hasMenuField = r.detail.menuDetails !== undefined && r.detail.menuDetails !== null;
    const deliveredSomething = menus.categories.length > 0 || menus.photos.length > 0 || menus.general !== null;

    // Verify each delivered photograph is actually reachable: a HEAD request
    // with a short timeout reports loadability without downloading the image.
    const loadStatuses = await Promise.all(
      menus.photos.slice(0, 12).map(async (photo) => {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 5000);
          const response = await fetch(photo.url, { method: "HEAD", signal: controller.signal });
          clearTimeout(timer);
          return response.ok ? null : `HTTP ${response.status}`;
        } catch {
          return "unreachable";
        }
      })
    );
    const failedLoads = menus.photos.slice(0, 12).map((p, i) => ({ url: p.url, reason: loadStatuses[i] })).filter((s) => s.reason !== null);

    if (!hasMenuField && menus.general === null && rawImageRefs.length === 0) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "warning",
        verification: "source-missing",
        evidence: ["CYA supplies no menuDetails or menuGeneral for this yacht — the section is hidden because there is genuinely no data."],
      };
    }

    // Match delivered photos against the normalized raw references so the
    // report can show exactly which supplied images reach the public page.
    const deliveredUrls = new Set(menus.photos.map((p) => p.url));
    const deliveredFromRefs = urlRefs.filter((ref) => ref.normalizedUrl !== null && deliveredUrls.has(ref.normalizedUrl));
    const deliveredElsewhere = menus.photos.filter((p) => !urlRefs.some((ref) => ref.normalizedUrl === p.url));
    const evidence = [
      `${menus.categories.length} menu category(ies) parsed.`,
      `${menus.photos.length} food photograph(s) delivered to the public Dining & Cuisine section (${deliveredFromRefs.length} from the image fields CYA supplies, ${deliveredElsewhere.length} from other menu sources).`,
      `Distinct photographs: ${new Set(menus.photos.map((p) => p.url)).size} of ${menus.photos.length}.`,
      menus.photos.length > 0
        ? failedLoads.length === 0
          ? `All delivered photograph URLs responded successfully (${Math.min(menus.photos.length, 12)} checked).`
          : `${failedLoads.length} delivered photograph URL(s) failed to load: ${failedLoads.map((f) => `${f.reason} (${f.url.slice(0, 60)}…)`).join("; ")}.`
        : "No photographs delivered.",
      menus.general ? "General dining description present." : "No general dining description.",
    ];
    for (const ref of rawImageRefs) {
      const outcomeLabel =
        ref.outcome === "delivered"
          ? "delivered"
          : ref.outcome === "duplicate"
            ? `NOT delivered — duplicate of ${ref.duplicateOf} (same image, deduplicated)`
            : `NOT delivered${ref.rejectionReason ? ` — ${ref.rejectionReason}` : ""}`;
      evidence.push(`${ref.path} (${ref.kind})${ref.url ? ` → ${ref.url}` : ""}: ${outcomeLabel}`);
    }

    if (deliveredSomething && urlRefs.length > 0 && menus.photos.length === 0) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "warning",
        verification: "parser-mapping-failure",
        evidence: [
          ...evidence,
          "CYA supplies food-photography URLs but the parser delivered none of them — images are being discarded by a mapping gap.",
        ],
      };
    }

    if (deliveredSomething) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: failedLoads.length > 0 ? "warning" : "healthy",
        verification: failedLoads.length > 0 ? "parser-mapping-failure" : "delivered-not-browser-verified",
        evidence: [
          ...evidence,
          "Content is delivered to the public Dining & Cuisine section; rendering in a browser has not been observed by this automated check.",
        ],
      };
    }

    if (urlRefs.length > 0) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "warning",
        verification: "parser-mapping-failure",
        evidence: [...evidence, "Only photography URLs were recognized — no menu text parsed alongside them."],
      };
    }

    return {
      yachtId: r.yachtId,
      yachtName: r.name,
      status: "failed",
      verification: "parser-mapping-failure",
      evidence: [...evidence, "menuDetails exists in the CYA record but the parser recognized no menu content in it — a parser defect, not missing data."],
    };
    })
  );
  return {
    id: "dining",
    title: "Dining & menus",
    status: worstStatus(yachts.map((y) => y.status)),
    verification: worstVerification(yachts.map((y) => y.verification)),
    summary:
      yachts.some((y) => y.status === "failed")
        ? "Menu data exists in CYA but the parser is not recognizing it."
        : yachts.some((y) => y.status === "warning")
          ? "Dining content parsed, but photography CYA supplies is not reaching the page."
          : yachts.every((y) => y.status === "healthy")
            ? "Menus and food photography parsed for every sampled yacht."
            : "Dining content checked; see per-yacht evidence.",
    evidence: [],
    yachts,
  };
}

async function checkAvailability(
  yachts: Array<{ yachtId: string; name: string | null }>
): Promise<HealthCheck> {
  const items: YachtCheckItem[] = await Promise.all(
    yachts.map(async (y) => {
      const availability = await getYachtAvailability(y.yachtId);
      if (availability.liveError) {
        return {
          yachtId: y.yachtId,
          yachtName: y.name,
          status: "failed",
          verification: "delivered-not-browser-verified",
          evidence: [`Live CYA bookings request failed: ${availability.liveError}.`],
        };
      }
      const liveCount = availability.ranges.length;
      return {
        yachtId: y.yachtId,
        yachtName: y.name,
        status: "healthy",
        verification: "delivered-not-browser-verified",
        evidence: [
          availability.hasLiveData
            ? `${availability.ranges.length} calendar range(s) merged; live CYA records present.`
            : `${availability.ranges.length} local range(s); no live CYA records visible to the key (a valid empty calendar, not an error).`,
          "Ranges are delivered to the calendar component; rendering in a browser has not been observed by this automated check.",
        ],
      };
    })
  );
  return {
    id: "availability",
    title: "Booking availability",
    status: worstStatus(items.map((y) => y.status)),
    verification: worstVerification(items.map((y) => y.verification)),
    summary:
      items.every((y) => y.status === "healthy")
        ? "Availability calendars resolved without live-data errors."
        : "The live CYA bookings request failed for at least one sampled yacht.",
    evidence: [],
    yachts: items,
  };
}

function enquiryClients(): { url: string | null; anonKey: string | null } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
  };
}

/* Non-destructive enquiry intake probe. The public form writes through the
 * anon role, which holds a column-level INSERT grant and an INSERT policy.
 * The probe submits an enquiry with privacy_consent = false, which the
 * table's CHECK constraint rejects before any row is stored: if the rejection
 * is that constraint violation, the connection, the grant, the policy and the
 * insert path all demonstrably work — with zero rows created and zero rows
 * deleted. Any customer enquiry row is never touched. */
async function checkEnquiries(): Promise<HealthCheck> {
  const { url, anonKey } = enquiryClients();
  if (!url || !anonKey) {
    return {
      id: "enquiries",
      title: "Enquiry intake",
      status: "not_tested",
      verification: "delivered-not-browser-verified",
      summary: "Not tested: the public database connection is not configured in this environment.",
      evidence: [
        !url ? "NEXT_PUBLIC_SUPABASE_URL is not set." : null,
        !anonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY is not set." : null,
      ].filter((e): e is string => e !== null),
      yachts: [],
    };
  }
  const client = createClient(url, anonKey);
  try {
    const { error } = await client.from("yacht_enquiries").insert({
      client_request_id: `site-health-probe-${Date.now()}`,
      yacht_slug: "site-health-probe",
      yacht_name: "Site Health Probe",
      full_name: "[MCC Site Health probe — rejected by design]",
      email: "site-health@example.com",
      preferred_dates: "n/a",
      guest_count: 1,
      privacy_consent: false,
      additional_requests: "Deliberately invalid probe: privacy_consent=false so the database rejects it and no row is stored.",
    });
    if (!error) {
      // Unreachable in a correct schema, but if it happens a real row was stored.
      return {
        id: "enquiries",
        title: "Enquiry intake",
        status: "warning",
        verification: "delivered-not-browser-verified",
        summary: "The probe was unexpectedly accepted — one clearly-marked probe row now exists and should be removed.",
        evidence: ["client_request_id starts with site-health-probe-; remove it from the enquiry records."],
        yachts: [],
      };
    }
    if (error.code === "23514" || /check constraint/i.test(error.message)) {
      return {
        id: "enquiries",
        title: "Enquiry intake",
        status: "healthy",
        verification: "fully-verified",
        summary:
          "The enquiry intake path works end to end: connection, insert permission and validation all responded, and the probe was rejected by the database before any row was stored — no customer data touched.",
        evidence: [
          "Database rejected the deliberately-invalid probe with a CHECK-constraint error (code 23514).",
          "That rejection proves connectivity, the INSERT permission used by the public form, and server-side validation — without creating a row.",
        ],
        yachts: [],
      };
    }
    if (error.code === "42501" || /permission denied/i.test(error.message)) {
      return {
        id: "enquiries",
        title: "Enquiry intake",
        status: "failed",
        verification: "parser-mapping-failure",
        summary: "The database refused the insert — the public form's write permission is broken, so visitor enquiries would fail too.",
        evidence: [`Insert rejected: ${error.message}`],
        yachts: [],
      };
    }
    return {
      id: "enquiries",
      title: "Enquiry intake",
      status: "warning",
      verification: "delivered-not-browser-verified",
      summary: "The probe failed with an unexpected database error. No row was created, but the intake path should be reviewed.",
      evidence: [`Error ${error.code ?? "unknown"}: ${error.message}`],
      yachts: [],
    };
  } catch (err) {
    return {
      id: "enquiries",
      title: "Enquiry intake",
      status: "failed",
      verification: "delivered-not-browser-verified",
      summary: "Could not reach the enquiry database at all.",
      evidence: [err instanceof Error ? err.message.slice(0, 200) : "Unknown error"],
      yachts: [],
    };
  }
}

/* Audits which environment variables the website's real database connection
 * needs and which are present. Names only — values are never read into the
 * report. The enquiry form and the health monitor use the same public
 * connection (NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY);
 * archiving additionally needs the server's private SUPABASE_SERVICE_ROLE_KEY. */
function configurationAudit(): Array<{ variable: string; present: boolean; usedBy: string }> {
  const audit = (name: string, usedBy: string) => ({
    variable: name,
    present: Boolean(process.env[name]),
    usedBy,
  });
  return [
    audit("NEXT_PUBLIC_SUPABASE_URL", "Public site database connection (enquiry form and health monitor)"),
    audit("NEXT_PUBLIC_SUPABASE_ANON_KEY", "Public site database connection (enquiry form and health monitor)"),
    audit("SUPABASE_SERVICE_ROLE_KEY", "Health-run archiving and the enquiry probe's server-side reads"),
  ];
}

function deploymentMetadata(): DeploymentMetadata {
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.NEXT_PUBLIC_BUILD_COMMIT_SHA ?? "";
  const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ?? "";
  return {
    commitSha: commitSha ? commitSha : null,
    environment: process.env.VERCEL_ENV ?? process.env.NEXT_PUBLIC_VERCEL_ENVIRONMENT ?? null,
    buildTimestamp: buildTimestamp ? buildTimestamp : null,
    source: commitSha
      ? "Reported by the Vercel deployment environment."
      : "Not reported by this environment (not a Vercel build or metadata unavailable).",
  };
}

async function storeRun(
  checks: HealthCheck[],
  overall: HealthStatus,
  metadata: DeploymentMetadata,
  trigger: string
): Promise<StorageReport> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      stored: false,
      previousRunAt: null,
      regressions: [],
      note: "Results are shown but not archived. Archiving writes with the server's private database key, which is separate from the public one the website uses.",
      missingConfiguration: !url ? "NEXT_PUBLIC_SUPABASE_URL" : "SUPABASE_SERVICE_ROLE_KEY",
    };
  }
  const client = createClient(url, serviceKey);
  const { data: previous, error: previousError } = await client
    .from("site_health_runs")
    .select("ran_at, results")
    .order("ran_at", { ascending: false })
    .limit(1);
  const { error } = await client.from("site_health_runs").insert({
    overall_status: overall,
    results: checks,
    commit_sha: metadata.commitSha,
    trigger,
  });
  if (!error) {
    // Keep only the 90 most recent runs; DELETE is granted to service_role only.
    await client
      .from("site_health_runs")
      .delete()
      .lt("ran_at", new Date(Date.now() - 90 * 86_400_000).toISOString());
  }
  const previousRow = Array.isArray(previous) && previous.length > 0 ? (previous[0] as Record<string, unknown>) : null;
  const previousRunAt = previousRow && typeof previousRow.ran_at === "string" ? previousRow.ran_at : null;
  const regressions: string[] = [];
  if (previousRow && Array.isArray(previousRow.results)) {
    const prior = new Map<string, HealthStatus>();
    for (const item of previousRow.results as Array<Record<string, unknown>>) {
      if (typeof item.id === "string" && typeof item.status === "string") {
        prior.set(item.id, item.status as HealthStatus);
      }
    }
    const order: Record<HealthStatus, number> = { healthy: 0, not_tested: 1, warning: 2, failed: 3 };
    for (const check of checks) {
      const before = prior.get(check.id);
      if (before && order[check.status] > order[before]) {
        regressions.push(`${check.title}: ${before} → ${check.status}`);
      }
    }
  }
  const note = error
    ? `Archiving failed: ${error.message}${previousError ? ` (reading history also failed: ${previousError.message})` : ""}`
    : null;
  return {
    stored: !error,
    previousRunAt,
    regressions,
    note,
    missingConfiguration: error ? "SUPABASE_SERVICE_ROLE_KEY access to the site_health_runs table" : null,
  };
}

export async function runSiteHealth(yachtIds: string[], trigger: string): Promise<SiteHealthReport> {
  const ranAt = new Date().toISOString();
  const ids = yachtIds.length > 0 ? yachtIds.slice(0, 6) : [PRIMARY_YACHT_ID];

  const connection = await checkCyaConnection();
  const details = await Promise.all(ids.map((yachtId) => fetchDetail(yachtId)));
  const sampled = details.map((d, i) => ({ yachtId: ids[i], ...d }));

  const catalogue = checkCatalogue(sampled);
  const crew = checkCrew(sampled);
  const dining = await checkDining(sampled);
  const availability = await checkAvailability(sampled.map((s) => ({ yachtId: s.yachtId, name: s.name })));
  const enquiries = await checkEnquiries();

  const checks = [connection, catalogue, crew, dining, availability, enquiries];
  const overall = worstStatus(checks.map((c) => c.status));
  const metadata = deploymentMetadata();
  const storage = await storeRun(checks, overall, metadata, trigger);
  const browserYachts = await getBrowserVerification(ids);
  const hasAnyResult = Object.values(browserYachts).some((v) => v.latest !== null);
  const browser = {
    yachts: browserYachts,
    note: hasAnyResult
      ? "Results were produced by an external Playwright browser run and imported; they are not executed by this monitor."
      : "No imported browser results yet. A real browser test (Playwright — run manually or via GitHub Actions after deploy) must be imported before anything can be labelled fully verified.",
  };

  return { ranAt, overall, checks, metadata, storage, configuration: configurationAudit(), browser };
}
