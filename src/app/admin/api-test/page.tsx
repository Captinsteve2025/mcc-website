"use client";

import { useState } from "react";

type TestResult = {
  status: number;
  ok: boolean;
  body: Record<string, unknown>;
};

export default function AdminApiTestPage() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runTest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/cya-test", {
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

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-2 font-display text-3xl italic text-[#061625]">API Connection Test</h1>
      <p className="mb-8 text-sm leading-relaxed text-[#061625]/70">
        Administrator only. Runs a server-side connectivity check against the Central Yacht Agent
        API. Your token is sent once in a request header, is not stored, and never appears in the
        address bar.
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
          {loading ? "Testing…" : "Run connection test"}
        </button>
      </form>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="rounded-lg border border-[#061625]/10 bg-white p-6" aria-live="polite">
          <p className="mb-4 text-sm font-medium text-[#061625]">
            Server response: {result.status} {result.ok ? "(authorized)" : "(rejected)"}
          </p>
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
  );
}
