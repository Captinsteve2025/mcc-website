"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type HealthStatus = "healthy" | "warning" | "failed" | "not_tested";

type YachtCheckItem = {
  yachtId: string;
  yachtName: string | null;
  status: HealthStatus;
  verification: string;
  evidence: string[];
};

type HealthCheck = {
  id: string;
  title: string;
  status: HealthStatus;
  verification: string;
  summary: string;
  evidence: string[];
  yachts: YachtCheckItem[];
};

type DeploymentMetadata = {
  commitSha: string | null;
  environment: string | null;
  buildTimestamp: string | null;
  source: string;
};

type StorageReport = {
  stored: boolean;
  previousRunAt: string | null;
  regressions: string[];
  note: string | null;
  missingConfiguration: string | null;
};

type SiteHealthReport = {
  ranAt: string;
  overall: HealthStatus;
  checks: HealthCheck[];
  metadata: DeploymentMetadata;
  storage: StorageReport;
  configuration: Array<{ variable: string; present: boolean; usedBy: string }>;
};

const VERIFICATION_LABELS: Record<string, string> = {
  "source-missing": "Source data missing",
  "parser-mapping-failure": "Parser mapping failure",
  "delivered-not-browser-verified": "Delivered, not browser-verified",
  "fully-verified": "Fully verified in production",
};

const STATUS_STYLES: Record<HealthStatus, { chip: string; label: string }> = {
  healthy: { chip: "bg-green-100 text-green-800", label: "Healthy" },
  warning: { chip: "bg-[#EE9739]/20 text-[#8a4a0d]", label: "Warning" },
  failed: { chip: "bg-red-100 text-red-800", label: "Failed" },
  not_tested: { chip: "bg-[#061625]/10 text-[#061625]/70", label: "Not tested" },
};

function StatusChip({ status }: { status: HealthStatus }) {
  const style = STATUS_STYLES[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.chip}`}>{style.label}</span>;
}

function VerificationChip({ level }: { level: string }) {
  const label = VERIFICATION_LABELS[level] ?? level;
  const style =
    level === "fully-verified"
      ? "border-green-600/40 text-green-700"
      : level === "delivered-not-browser-verified"
        ? "border-[#337891]/40 text-[#337891]"
        : level === "source-missing"
          ? "border-[#061625]/25 text-[#061625]/70"
          : "border-red-600/40 text-red-700";
  return <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${style}`}>{label}</span>;
}

const PRESET_YACHTS: Array<{ name: string; id: string }> = [
  { name: "ENDLESS HORIZON", id: "69f33df0b5a1600bf785869e" },
  { name: "MISCHIEVOUS", id: "69f33df2b5a1600bf78586a2" },
  { name: "OHANA", id: "6a023755ce6b8709506dfee5" },
  { name: "VIVA LA VIDA", id: "69f83a8e8ae166becdd09df5" },
];

function DeploymentMetadataCard({ metadata }: { metadata: DeploymentMetadata }) {
  return (
    <div className="rounded-lg border border-[#061625]/10 bg-white p-6">
      <h2 className="mb-1 font-display text-lg italic text-[#061625]">Deployment</h2>
      <p className="mb-4 text-sm leading-relaxed text-[#061625]/70">
        Reported by the environment this check ran in. Values the environment does not supply are shown as
        absent — they are never guessed.
      </p>
      <dl className="space-y-2 text-sm">
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-medium text-[#061625]">Deployed commit:</dt>
          <dd className="break-all font-mono text-[#061625]/75">
            {metadata.commitSha ? (metadata.commitSha.length > 12 ? `${metadata.commitSha.slice(0, 12)}…` : metadata.commitSha) : "Not reported"}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-medium text-[#061625]">Environment:</dt>
          <dd className="text-[#061625]/75">{metadata.environment ?? "Not reported"}</dd>
        </div>
        <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
          <dt className="shrink-0 font-medium text-[#061625]">Build timestamp:</dt>
          <dd className="text-[#061625]/75">{metadata.buildTimestamp ?? "Not reported"}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs italic text-[#061625]/60">{metadata.source}</p>
    </div>
  );
}

export default function AdminSiteHealthPage() {
  const [token, setToken] = useState("");
  const [yachtIds, setYachtIds] = useState<string[]>([PRESET_YACHTS[0].id]);
  const [report, setReport] = useState<SiteHealthReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(
    async (adminToken: string, ids: string[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/site-health?yacht_ids=${encodeURIComponent(ids.join(","))}`, {
          headers: { "x-admin-token": adminToken },
        });
        const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        if (!response.ok) {
          setError(typeof body.error === "string" ? body.error : `Request failed (server response ${response.status}).`);
          setReport(null);
        } else {
          setReport(body as unknown as SiteHealthReport);
        }
      } catch {
        setError("The request to this website's server failed. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // The page can be opened with #token=<admin token> so an automated runner or
  // a scheduled job can execute a check without typing the token. Nothing is
  // stored; the fragment never reaches the server.
  useEffect(() => {
    const match = window.location.hash.match(/^#token=(.+)$/);
    const autoToken = match ? decodeURIComponent(match[1]) : null;
    const saved = window.sessionStorage.getItem("mcc-admin-token");
    const resolved = autoToken ?? saved;
    if (resolved) {
      setToken(resolved);
      void runCheck(resolved, [PRESET_YACHTS[0].id]);
      if (autoToken) window.sessionStorage.setItem("mcc-admin-token", autoToken);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [runCheck]);

  function toggleYacht(id: string) {
    setYachtIds((prev) => (prev.includes(id) ? prev.filter((y) => y !== id) : [...prev, id]));
  }

  const overallStyle = report ? STATUS_STYLES[report.overall] : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 font-display text-3xl italic text-[#061625]">Site Health Monitor</h1>
      <p className="mb-8 text-sm leading-relaxed text-[#061625]/70">
        Runs six production checks — CYA API connection, the yacht catalogue, crew profiles, dining content,
        booking availability, and enquiry intake — and reports exactly what it observed, distinguishing missing
        CYA data from parser defects. Results are archived so regressions against the previous run are flagged.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runCheck(token, yachtIds.length > 0 ? yachtIds : [PRESET_YACHTS[0].id]);
          window.sessionStorage.setItem("mcc-admin-token", token);
        }}
        className="mb-8 space-y-4"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#061625]">Administrator token</span>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="off"
            required
            className="w-full rounded-md border border-[#061625]/20 bg-white px-4 py-3 text-[#061625] focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
            placeholder="Enter ADMIN_API_TOKEN"
          />
        </label>

        <fieldset>
          <legend className="mb-2 block text-sm font-medium text-[#061625]">Yachts to sample</legend>
          <div className="flex flex-wrap gap-2">
            {PRESET_YACHTS.map((y) => (
              <button
                key={y.id}
                type="button"
                onClick={() => toggleYacht(y.id)}
                aria-pressed={yachtIds.includes(y.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  yachtIds.includes(y.id)
                    ? "border-[#EE9739] bg-[#EE9739]/15 text-[#061625]"
                    : "border-[#061625]/20 text-[#061625]/70 hover:bg-[#061625]/5"
                }`}
              >
                {y.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-[#061625]/60">
            Every selected yacht is fetched from CYA once per check — the whole catalogue is never re-fetched.
          </p>
        </fieldset>

        <button
          type="submit"
          disabled={loading || !token}
          className="rounded-full bg-[#EE9739] px-6 py-3 text-sm font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Running full website check…" : "Run Full Website Check"}
        </button>
      </form>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {report && (
        <div className="space-y-6" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#061625]/10 bg-white p-6">
            <div>
              <p className="text-sm font-medium text-[#061625]">Overall status</p>
              <p className="text-xs text-[#061625]/60">Run completed {new Date(report.ranAt).toLocaleString()}</p>
            </div>
            {overallStyle && <span className={`rounded-full px-4 py-2 text-sm font-semibold ${overallStyle.chip}`}>{overallStyle.label}</span>}
          </div>

          {report.storage.regressions.length > 0 && (
            <div className="rounded-lg border border-[#EE9739]/40 bg-[#EE9739]/10 p-5">
              <p className="text-sm font-semibold text-[#061625]">Regressions since the previous run ({new Date(report.storage.previousRunAt ?? "").toLocaleString()})</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#061625]/80">
                {report.storage.regressions.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {report.storage.note && <p className="text-xs italic text-[#061625]/60">{report.storage.note}</p>}

          {report.storage.missingConfiguration && (
            <div className="rounded-lg border border-[#EE9739]/40 bg-[#EE9739]/10 p-5">
              <p className="text-sm font-semibold text-[#061625]">Health-run archiving is not active</p>
              <p className="mt-1 text-sm leading-relaxed text-[#061625]/80">
                The environment variable <span className="font-mono">{report.storage.missingConfiguration}</span> is not
                available to this deployment. It is the server&apos;s private database key — it is separate from the
                public website key and must be added to the Vercel project&apos;s environment variables (Production),
                then redeployed. No new database is needed.
              </p>
            </div>
          )}

          <DeploymentMetadataCard metadata={report.metadata} />

          <div className="rounded-lg border border-[#061625]/10 bg-white p-6">
            <h2 className="mb-1 font-display text-lg italic text-[#061625]">Database configuration</h2>
            <p className="mb-4 text-sm leading-relaxed text-[#061625]/70">
              The environment variables the website&apos;s database connection uses, whether each is present in this
              deployment, and what it is used for. Only names are shown — never values.
            </p>
            <ul className="space-y-2 text-sm">
              {report.configuration.map((c) => (
                <li key={c.variable} className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {c.present ? "Present" : "Missing"}
                  </span>
                  <span className="font-mono text-[#061625]">{c.variable}</span>
                  <span className="text-[#061625]/70">— {c.usedBy}</span>
                </li>
              ))}
            </ul>
          </div>

          {report.checks.map((check) => (
            <div key={check.id} className="rounded-lg border border-[#061625]/10 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-lg italic text-[#061625]">{check.title}</h2>
                <div className="flex items-center gap-2">
                  <VerificationChip level={check.verification} />
                  <StatusChip status={check.status} />
                </div>
              </div>
              <p className="mt-2 text-sm text-[#061625]/80">{check.summary}</p>

              {check.evidence.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#061625]/70">
                  {check.evidence.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              )}

              {check.yachts.map((y) => (
                <div key={y.yachtId} className="mt-4 rounded-md border border-[#061625]/10 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[#061625]">
                      {y.yachtName ?? "Unknown yacht"}{" "}
                      <span className="font-mono text-xs font-normal text-[#061625]/60">{y.yachtId}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      <VerificationChip level={y.verification} />
                      <StatusChip status={y.status} />
                    </div>
                  </div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[#061625]/70">
                    {y.evidence.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <p className="mt-12 text-sm text-[#061625]/60">
        Need per-field parser detail? Open the{" "}
        <Link href="/admin/api-test" className="text-[#337891] underline underline-offset-4">
          CYA API diagnostics
        </Link>{" "}
        page.
      </p>
    </div>
  );
}
