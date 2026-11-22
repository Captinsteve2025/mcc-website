"use client";

import { useState } from "react";

type TestResult = {
  status: number;
  ok: boolean;
  body: Record<string, unknown>;
};

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
            className="w-full rounded-md border border-[#061625]/20 bg-white px-4 py-3 text-[#061625] focus:outline-none focus:ring-2 focus:ring-[#e89d79]"
            placeholder="Enter ADMIN_API_TOKEN"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !token}
          className="rounded-full bg-[#e89d79] px-6 py-3 text-sm font-medium text-[#061625] transition-colors hover:bg-[#d88a66] disabled:cursor-not-allowed disabled:opacity-50"
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
            <div className="rounded-lg border border-[#e89d79]/40 bg-[#e89d79]/10 p-4">
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
