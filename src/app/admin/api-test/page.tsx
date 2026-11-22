"use client";

import { useState } from "react";

type TestResult = {
  status: number;
  ok: boolean;
  body: Record<string, unknown>;
};

type AvailabilityResult = {
  status: number;
  ok: boolean;
  body: Record<string, unknown>;
  yachtId: string;
};

const PRESET_YACHTS: Array<{ name: string; id: string }> = [
  { name: "ENDLESS HORIZON", id: "69f33df0b5a1600bf785869e" },
  { name: "MISCHIEVOUS", id: "69f33df2b5a1600bf78586a2" },
  { name: "OHANA", id: "6a023755ce6b8709506dfee5" },
  { name: "VIVA LA VIDA", id: "69f83a8e8ae166becdd09df5" },
];

type TestDetail = {
  label?: string;
  httpStatus?: number;
  contentType?: string | null;
  safeHeaders?: Record<string, string>;
  errorInfo?: string | null;
  areaCount?: number | null;
  sampleAreas?: string[];
};

function TestCard({ title, detail }: { title: string; detail?: TestDetail }) {
  if (!detail) return null;
  return (
    <div className="flex-1 rounded-lg border border-[#061625]/10 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-[#061625]">{detail.label ?? title}</h3>
      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-[#061625]">CYA HTTP status:</dt>
          <dd className={detail.httpStatus === 200 ? "text-green-700" : "text-red-700"}>
            {detail.httpStatus ?? "unknown"}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="shrink-0 font-medium text-[#061625]">Content type:</dt>
          <dd className="text-[#061625]/75 break-words">{detail.contentType ?? "none"}</dd>
        </div>
        {detail.errorInfo != null && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-[#061625]">API error info:</dt>
            <dd className="text-[#061625]/75 break-words">{detail.errorInfo}</dd>
          </div>
        )}
        {typeof detail.areaCount === "number" && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-[#061625]">Cruising areas:</dt>
            <dd className="text-green-700">
              {detail.areaCount} received
              {detail.sampleAreas && detail.sampleAreas.length > 0
                ? ` (sample: ${detail.sampleAreas.join(", ")})`
                : ""}
            </dd>
          </div>
        )}
        {detail.safeHeaders && Object.keys(detail.safeHeaders).length > 0 && (
          <div className="flex gap-2">
            <dt className="shrink-0 font-medium text-[#061625]">Diagnostic headers:</dt>
            <dd className="text-[#061625]/75 break-words">
              {Object.entries(detail.safeHeaders)
                .map(([k, v]) => `${k}: ${v}`)
                .join("; ")}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export default function AdminApiTestPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<TestResult | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [yachtIdInput, setYachtIdInput] = useState(PRESET_YACHTS[0].id);
  const [availabilityResult, setAvailabilityResult] = useState<AvailabilityResult | null>(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  async function runTest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/cya-test?diagnose=1", {
        headers: { "x-admin-token": token },
      });
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      setResult({ status: response.status, ok: response.ok, body });
    } catch {
      setError("The request to this website's server failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function runVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyLoading(true);
    setError(null);
    setVerifyResult(null);
    try {
      const response = await fetch("/api/cya-verify", {
        headers: { "x-admin-token": token },
      });
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      setVerifyResult({ status: response.status, ok: response.ok, body });
    } catch {
      setError("The request to this website's server failed. Check your connection and try again.");
    } finally {
      setVerifyLoading(false);
    }
  }

  async function runAvailability(yachtId: string) {
    setAvailabilityLoading(true);
    setError(null);
    setAvailabilityResult(null);
    try {
      const response = await fetch(`/api/cya-availability?yacht_id=${encodeURIComponent(yachtId)}`, {
        headers: { "x-admin-token": token },
      });
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      setAvailabilityResult({ status: response.status, ok: response.ok, body, yachtId });
    } catch {
      setError("The request to this website's server failed. Check your connection and try again.");
    } finally {
      setAvailabilityLoading(false);
    }
  }

  const tests = (result?.body?.tests ?? null) as { A?: TestDetail; B?: TestDetail } | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-2 font-display text-3xl italic text-[#061625]">CYA API Diagnostic</h1>
      <p className="mb-8 text-sm leading-relaxed text-[#061625]/70">
        Administrator only. Runs exactly two server-side requests to the Central Yacht Agent API —
        one standard, one carrying your registered domain headers — and compares them. Your token is
        sent once in a request header, is not stored, and never appears in the address bar.
      </p>

      <form onSubmit={runTest} className="mb-8 space-y-4">
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
        <button
          type="submit"
          disabled={loading || !token}
          className="rounded-full bg-[#EE9739] px-6 py-3 text-sm font-medium text-[#061625] transition-colors hover:bg-[#EA6F33] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Testing…" : "Run diagnostic"}
        </button>
      </form>

      <form onSubmit={runVerify} className="mb-8">
        <button
          type="submit"
          disabled={verifyLoading || !token}
          className="rounded-full border border-[#061625]/30 px-6 py-3 text-sm font-medium text-[#061625] transition-colors hover:bg-[#061625]/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {verifyLoading ? "Verifying…" : "Verify live data (areas + yachts)"}
        </button>
      </form>

      <section className="mb-8 rounded-lg border border-[#061625]/10 bg-white p-6">
        <h2 className="mb-1 font-display text-lg italic text-[#061625]">Yacht availability tester</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#061625]/70">
          Tests one yacht&apos;s CYA bookings without running the full catalogue diagnostic: HTTP status,
          booking count, date ranges and categories, the sanitized raw response, and whether the
          endpoint returns only this yacht&apos;s records or the whole account&apos;s. An empty result means
          &ldquo;no records visible to the key&rdquo; — it is never treated as the yacht being free.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESET_YACHTS.map((y) => (
            <button
              key={y.id}
              type="button"
              onClick={() => setYachtIdInput(y.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                yachtIdInput === y.id
                  ? "border-[#EE9739] bg-[#EE9739]/15 text-[#061625]"
                  : "border-[#061625]/20 text-[#061625]/70 hover:bg-[#061625]/5"
              }`}
            >
              {y.name}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={yachtIdInput}
            onChange={(e) => setYachtIdInput(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border border-[#061625]/20 bg-white px-4 py-3 font-mono text-sm text-[#061625] focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
            placeholder="CYA yacht id"
          />
          <button
            type="button"
            disabled={availabilityLoading || !token || !yachtIdInput.trim()}
            onClick={() => runAvailability(yachtIdInput.trim())}
            className="shrink-0 rounded-full bg-[#061625] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#061625]/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {availabilityLoading ? "Testing…" : "Test Availability"}
          </button>
        </div>

        {availabilityResult && (
          <div className="mt-5" aria-live="polite">
            {!availabilityResult.ok ? (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                Tester request failed (server response {availabilityResult.status}).
                {typeof availabilityResult.body.error === "string" ? ` ${availabilityResult.body.error}` : ""}
              </p>
            ) : (
              <AvailabilityReport body={availabilityResult.body} />
            )}
          </div>
        )}
      </section>

      {verifyResult && (
        <div className="mb-8 rounded-lg border border-[#061625]/10 bg-white p-6" aria-live="polite">
          <h2 className="mb-4 text-sm font-semibold text-[#061625]">Live data verification</h2>
          <dl className="space-y-3 text-sm">
            {Object.entries(verifyResult.body).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                <dt className="shrink-0 font-medium text-[#061625]">{key}:</dt>
                <dd className="text-[#061625]/75 break-words">
                  {typeof value === "object" ? JSON.stringify(value, null, 1) : String(value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-4" aria-live="polite">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-[#061625]">MCC administrator authentication</p>
              <p className={`text-lg ${result.ok ? "text-green-700" : "text-red-700"}`}>
                {result.ok ? "Successful" : `Failed (server response ${result.status})`}
              </p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-[#061625]">CYA API authentication</p>
              <p
                className={`text-lg ${
                  tests?.A?.httpStatus === 200 || tests?.B?.httpStatus === 200
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {tests
                  ? tests.A?.httpStatus === 200 || tests.B?.httpStatus === 200
                    ? "Successful"
                    : `Rejected (CYA status ${tests.A?.httpStatus ?? "unknown"})`
                  : "Not completed"}
              </p>
            </div>
          </div>

          {typeof result.body.comparison === "string" && (
            <p className="rounded-lg bg-white p-4 text-sm text-[#061625]/80 shadow-sm">
              {result.body.comparison}
            </p>
          )}

          <div className="flex flex-col gap-4 sm:flex-row">
            <TestCard title="Test A" detail={tests?.A} />
            <TestCard title="Test B" detail={tests?.B} />
          </div>

          {typeof result.body.likelyCause === "string" && (
            <div className="rounded-lg border border-[#EE9739]/40 bg-[#EE9739]/10 p-4">
              <p className="text-sm font-semibold text-[#061625]">Likely explanation</p>
              <p className="mt-1 text-sm text-[#061625]/80">{result.body.likelyCause}</p>
            </div>
          )}

          {!tests && Object.keys(result.body).length > 0 && (
            <div className="rounded-lg border border-[#061625]/10 bg-white p-6">
              <dl className="space-y-2 text-sm">
                {Object.entries(result.body).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
                    <dt className="font-medium text-[#061625]">{key}:</dt>
                    <dd className="text-[#061625]/75 break-words">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

type BookingRow = {
  id?: string | null;
  start?: string | null;
  end?: string | null;
  category?: string | null;
  holdExpireDate?: string | null;
  holdExpired?: boolean | null;
  title?: string | null;
  yachtId?: string | null;
  yachtName?: string | null;
};

function AvailabilityReport({ body }: { body: Record<string, unknown> }) {
  const raw = (body.rawResponse ?? null) as Record<string, unknown> | null;
  const appPath = (body.appPath ?? null) as Record<string, unknown> | null;
  const scope = (body.scopeCheck ?? null) as Record<string, unknown> | null;
  const yachtKnown = (body.yachtKnownToCya ?? null) as Record<string, unknown> | null;
  const rows = (raw?.bookings ?? []) as BookingRow[];
  const total = typeof raw?.totalBookings === "number" ? raw.totalBookings : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 text-sm">
        <p className="text-[#061625]">
          <span className="font-medium">Yacht id:</span>{" "}
          <span className="font-mono">{String(body.yachtId ?? "")}</span>
        </p>
        <p className="break-words text-[#061625]/75">
          <span className="font-medium text-[#061625]">Request:</span> {String(body.fullRequestPath ?? "")}
        </p>
        {yachtKnown && (
          <p className="text-[#061625]/75">
            <span className="font-medium text-[#061625]">Yacht known to CYA:</span>{" "}
            {yachtKnown.known === true ? "Yes (catalogue 200)" : `No (${String(yachtKnown.httpStatus ?? "error")})`}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-[#061625]/5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">HTTP status</p>
          <p className={`text-lg ${raw?.httpStatus === 200 ? "text-green-700" : "text-red-700"}`}>
            {String(raw?.httpStatus ?? "—")}
          </p>
        </div>
        <div className="rounded-md bg-[#061625]/5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">Total bookings</p>
          <p className="text-lg text-[#061625]">{total ?? "—"}</p>
        </div>
        <div className="rounded-md bg-[#061625]/5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">Response shape</p>
          <p className="truncate text-lg text-[#061625]" title={String(raw?.shape ?? "")}>
            {String(raw?.shape ?? "—")}
          </p>
        </div>
      </div>

      <div className="rounded-md border border-[#061625]/10 p-4">
        <p className="mb-1 text-sm font-semibold text-[#061625]">Endpoint scope</p>
        {scope ? (
          <>
            <p className="text-sm text-[#061625]">{String(scope.determination ?? "—")}</p>
            <p className="mt-1 text-sm leading-relaxed text-[#061625]/70">{String(scope.explanation ?? "")}</p>
          </>
        ) : (
          <p className="text-sm text-[#061625]/70">Not available.</p>
        )}
      </div>

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-md border border-[#061625]/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#061625]/5 text-xs uppercase tracking-wide text-[#061625]/60">
                <th className="px-3 py-2">Start</th>
                <th className="px-3 py-2">End</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Hold expires</th>
                <th className="px-3 py-2">Title</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b, i) => (
                <tr key={b.id ?? i} className="border-t border-[#061625]/10">
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">{b.start ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 font-mono text-xs">{b.end ?? "—"}</td>
                  <td className="px-3 py-2">{b.category ?? "—"}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs">
                    {b.holdExpireDate ?? "—"}
                    {b.holdExpired ? " (expired)" : ""}
                  </td>
                  <td className="px-3 py-2 text-[#061625]/75">{b.title ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-md bg-[#EE9739]/10 px-4 py-3 text-sm text-[#061625]/80">
          Zero booking records in the response. This is NOT proof the yacht is free: it means no calendar
          records are visible to the key for this yacht (or the account holds none at all — see the scope
          finding above).
        </p>
      )}

      {appPath && typeof appPath.bookingCount === "number" && (
        <p className="text-sm text-[#061625]/75">
          <span className="font-medium text-[#061625]">Calendar code path result:</span>{" "}
          {String(appPath.bookingCount)} record(s) via the same function the public calendar uses
          {typeof appPath.httpStatus === "number" ? ` (HTTP ${appPath.httpStatus})` : ""}.
        </p>
      )}

      <details className="rounded-md border border-[#061625]/10 p-4">
        <summary className="cursor-pointer text-sm font-semibold text-[#061625]">
          Sanitized raw response (for troubleshooting)
        </summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded bg-[#061625] p-3 text-xs leading-relaxed text-[#f5f0e8]">
          {JSON.stringify(raw?.sanitizedStructure ?? raw ?? body, null, 2)}
        </pre>
      </details>
    </div>
  );
}
