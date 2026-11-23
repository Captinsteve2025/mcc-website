import { createClient } from "@supabase/supabase-js";
import { CyaApiError, getOperatingAreasRaw, getYachtDetail, normalizeOperatingAreas } from "@/lib/cya";
import { parseCrewGeneral, parseCrewWithTrace, parseMenus } from "@/lib/yacht-detail";
import { getYachtAvailability } from "@/lib/yacht-content";

// Server-side production health monitor. Every check reports exactly what it
// observed — nothing is fabricated. CYA verdicts distinguish "CYA supplies no
// data" (warning) from "the parser failed to recognize data CYA supplies"
// (failed). Supabase-backed storage archives each run so regressions against
// the previous run can be surfaced.

export type HealthStatus = "healthy" | "warning" | "failed" | "not_tested";

export type YachtCheckItem = {
  yachtId: string;
  yachtName: string | null;
  status: HealthStatus;
  evidence: string[];
};

export type HealthCheck = {
  id: string;
  title: string;
  status: HealthStatus;
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
};

export type SiteHealthReport = {
  ranAt: string;
  overall: HealthStatus;
  checks: HealthCheck[];
  metadata: DeploymentMetadata;
  storage: StorageReport;
};

export const PRIMARY_YACHT_ID = "69f33df0b5a1600bf785869e"; // ENDLESS HORIZON

function worstStatus(statuses: HealthStatus[]): HealthStatus {
  if (statuses.includes("failed")) return "failed";
  if (statuses.includes("warning")) return "warning";
  if (statuses.includes("not_tested")) return "not_tested";
  return "healthy";
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
        evidence: [`Detail request failed: ${r.error ?? "unknown error"}`],
      };
    }
    if (r.name) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "healthy",
        evidence: ["Detail record returned with a yacht name.", `${Object.keys(r.detail).length} top-level fields.`],
      };
    }
    return {
      yachtId: r.yachtId,
      yachtName: null,
      status: "warning",
      evidence: ["Detail record returned but no yachtName field was found in it."],
    };
  });
  return {
    id: "catalogue",
    title: "Yacht catalogue",
    status: worstStatus(yachts.map((y) => y.status)),
    summary:
      yachts.every((y) => y.status === "healthy")
        ? "Every sampled yacht's CYA detail record is reachable."
        : "One or more sampled yachts could not be fetched from CYA.",
    evidence: [`${results.length} yacht(s) sampled.`],
    yachts,
  };
}

function checkCrew(
  results: Array<{ yachtId: string; detail: Record<string, unknown> | null; error: string | null; name: string | null }>
): HealthCheck {
  const yachts: YachtCheckItem[] = results.map((r) => {
    if (r.error || !r.detail) {
      return { yachtId: r.yachtId, yachtName: r.name, status: "not_tested", evidence: ["Skipped: the detail record could not be fetched."] };
    }
    const trace = parseCrewWithTrace(r.detail);
    const general = parseCrewGeneral(r.detail);
    if (trace.members.length > 0) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "healthy",
        evidence: [
          `${trace.members.length} crew profile(s) parsed from CYA.`,
          `Fields read: ${trace.matchedCollectionKeys.join(", ")}.`,
          general ? "General crew description present." : "No general crew description.",
        ],
      };
    }
    if (trace.crewShapedTopLevelKeys.length > 0) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "failed",
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
      evidence: ["CYA supplies no crew fields for this yacht — the section is hidden because there is genuinely no data."],
    };
  });
  return {
    id: "crew",
    title: "Crew profiles",
    status: worstStatus(yachts.map((y) => y.status)),
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

function checkDining(
  results: Array<{ yachtId: string; detail: Record<string, unknown> | null; error: string | null; name: string | null }>
): HealthCheck {
  const yachts: YachtCheckItem[] = results.map((r) => {
    if (r.error || !r.detail) {
      return { yachtId: r.yachtId, yachtName: r.name, status: "not_tested", evidence: ["Skipped: the detail record could not be fetched."] };
    }
    const menus = parseMenus(r.detail);
    const hasMenuField = r.detail.menuDetails !== undefined && r.detail.menuDetails !== null;
    if (menus.categories.length > 0 || menus.photos.length > 0 || menus.general) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "healthy",
        evidence: [
          `${menus.categories.length} menu category(ies) parsed.`,
          `${menus.photos.length} food photograph(s) parsed.`,
          menus.general ? "General dining description present." : "No general dining description.",
        ],
      };
    }
    if (hasMenuField) {
      return {
        yachtId: r.yachtId,
        yachtName: r.name,
        status: "failed",
        evidence: ["menuDetails exists in the CYA record but the parser recognized no menu content in it — a parser defect, not missing data."],
      };
    }
    return {
      yachtId: r.yachtId,
      yachtName: r.name,
      status: "warning",
      evidence: ["CYA supplies no menuDetails or menuGeneral for this yacht — the section is hidden because there is genuinely no data."],
    };
  });
  return {
    id: "dining",
    title: "Dining & menus",
    status: worstStatus(yachts.map((y) => y.status)),
    summary:
      yachts.some((y) => y.status === "failed")
        ? "Menu data exists in CYA but the parser is not recognizing it."
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
          evidence: [`Live CYA bookings request failed: ${availability.liveError}.`],
        };
      }
      const liveCount = availability.ranges.filter((r) => r.status !== "available").length;
      return {
        yachtId: y.yachtId,
        yachtName: y.name,
        status: "healthy",
        evidence: [
          availability.hasLiveData
            ? `${availability.ranges.length} calendar range(s) merged; live CYA records present.`
            : `${availability.ranges.length} local range(s); no live CYA records visible to the key (a valid empty calendar, not an error).`,
        ],
      };
    })
  );
  return {
    id: "availability",
    title: "Booking availability",
    status: worstStatus(items.map((y) => y.status)),
    summary:
      items.every((y) => y.status === "healthy")
        ? "Availability calendars resolved without live-data errors."
        : "The live CYA bookings request failed for at least one sampled yacht.",
    evidence: [],
    yachts: items,
  };
}

async function checkEnquiries(trigger: string): Promise<HealthCheck> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      id: "enquiries",
      title: "Enquiry intake",
      status: "not_tested",
      summary: "Not tested: the server-side service credentials needed for a safe write-and-clean-up test are not configured in this environment.",
      evidence: [],
      yachts: [],
    };
  }
  const client = createClient(url, serviceKey);
  const requestId = `site-health-${Date.now()}`;
  try {
    const { error: insertError } = await client.from("yacht_enquiries").insert({
      client_request_id: requestId,
      yacht_slug: "site-health-test",
      yacht_name: "Site Health Monitor",
      full_name: "[MCC Site Health test submission]",
      email: "site-health@example.com",
      preferred_dates: "n/a",
      guest_count: 1,
      privacy_consent: true,
      additional_requests: `Automated test-mode submission by the ${trigger} health check; deleted immediately after insert.`,
    });
    if (insertError) {
      return {
        id: "enquiries",
        title: "Enquiry intake",
        status: "failed",
        summary: "A test-mode enquiry insert was rejected — enquiry intake may be broken for visitors too.",
        evidence: [`Insert error: ${insertError.message}`],
        yachts: [],
      };
    }
    const { error: deleteError } = await client.from("yacht_enquiries").delete().eq("client_request_id", requestId);
    if (deleteError) {
      return {
        id: "enquiries",
        title: "Enquiry intake",
        status: "warning",
        summary: "The test enquiry was accepted (intake works) but automatic clean-up failed — one clearly-marked test row remains.",
        evidence: [`Delete error: ${deleteError.message}`, `Test row client_request_id: ${requestId}`],
        yachts: [],
      };
    }
    return {
      id: "enquiries",
      title: "Enquiry intake",
      status: "healthy",
      summary: "A clearly-marked test enquiry was accepted and removed — enquiry intake works end to end.",
      evidence: ["Test-mode round trip completed with no residue."],
      yachts: [],
    };
  } catch (err) {
    return {
      id: "enquiries",
      title: "Enquiry intake",
      status: "failed",
      summary: "The test-mode enquiry check threw unexpectedly.",
      evidence: [err instanceof Error ? err.message.slice(0, 200) : "Unknown error"],
      yachts: [],
    };
  }
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

async function storeRun(checks: HealthCheck[], overall: HealthStatus, metadata: DeploymentMetadata, trigger: string): Promise<StorageReport> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return {
      stored: false,
      previousRunAt: null,
      regressions: [],
      note: "Results are shown but not archived: the service credentials needed to write the health-run history are not configured in this environment.",
    };
  }
  const client = createClient(url, serviceKey);
  const { data: previous } = await client
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
  // Keep only the 90 most recent runs; DELETE is granted to service_role only.
  await client.from("site_health_runs").delete().not("ran_at", "lt", new Date(Date.now() - 90 * 86_400_000).toISOString()).order("ran_at", { ascending: false }).range(90, 10_000);
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
  return {
    stored: !error,
    previousRunAt,
    regressions,
    note: error ? `Archiving failed: ${error.message}` : null,
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
  const dining = checkDining(sampled);
  const availability = await checkAvailability(sampled.map((s) => ({ yachtId: s.yachtId, name: s.name })));
  const enquiries = await checkEnquiries(trigger);

  const checks = [connection, catalogue, crew, dining, availability, enquiries];
  const overall = worstStatus(checks.map((c) => c.status));
  const metadata = deploymentMetadata();
  const storage = await storeRun(checks, overall, metadata, trigger);

  return { ranAt, overall, checks, metadata, storage };
}
