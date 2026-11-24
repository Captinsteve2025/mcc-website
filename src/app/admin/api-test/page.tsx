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

type CrewResult = {
  status: number;
  ok: boolean;
  body: Record<string, unknown>;
  yachtId: string;
};

type DiningResult = {
  status: number;
  ok: boolean;
  body: Record<string, unknown>;
  yachtId: string;
};

type MenuPhotoReport = { url: string; description: string | null; path: string };

type MenuYachtReport = {
  yachtId: string;
  yachtName: string | null;
  error?: string;
  menus?: {
    menuDetailsPresent: boolean;
    menuDetailsType: string;
    menuGeneralPresent: boolean;
    categories: Array<{ title: string; path: string; bodyFormat: string; bodyPreview: string | null; photo: MenuPhotoReport | null }>;
    categoryCount: number;
    photoCount: number;
    photos: MenuPhotoReport[];
    general: { photo: MenuPhotoReport | null; descriptionHtml: string | null; descriptionText: string | null } | null;
    omittedFields: Array<{ path: string; type: string; preview: string | null }>;
    verdict: { code: string; headline: string; explanation?: string };
  };
};

type CrewMemberReport = {
  name: string;
  role: string;
  bioPresent: boolean;
  bioPreview: string | null;
  photoUrl: string | null;
  nationality: string | null;
  languages: string | null;
  qualifications: string | null;
  interests: string | null;
  culinaryBackground: string | null;
  paths: Record<string, string | null>;
};

type CrewYachtReport = {
  yachtId: string;
  yachtName: string | null;
  verdict?: { code: string; headline: string; explanation: string };
  parsedCount?: number;
  members?: CrewMemberReport[];
  fieldPathsUsed?: string[];
  crewShapedRawFields?: Array<{ key: string; type: string; matched: boolean; preview: string | null }>;
  omittedData?: Array<{ path: string; type: string; preview: string | null }>;
  delivered?: Array<{ name: string; role: string; source: string; bioPresent: boolean; bioCharacters: number | null; photoPresent: boolean }>;
  allTopLevelFields?: string[];
  error?: string;
};

const PRESET_YACHTS: Array<{ name: string; id: string }> = [
  { name: "ENDLESS HORIZON", id: "69f33df0b5a1600bf785869e" },
  { name: "MISCHIEVOUS", id: "69f33df2b5a1600bf78586a2" },
  { name: "OHANA", id: "6a023755ce6b8709506dfee5" },
  { name: "VIVA LA VIDA", id: "69f83a8e8ae166becdd09df5" },
];

// XANDROS appears wherever its CYA id is known (responsive-defect yacht). Set
// via the environment when the id is confirmed; hidden from the presets until then.
const XANDROS_ID = process.env.NEXT_PUBLIC_XANDROS_CYA_ID ?? "";
if (XANDROS_ID) PRESET_YACHTS.push({ name: "XANDROS", id: XANDROS_ID });


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
  const [crewResult, setCrewResult] = useState<CrewResult | null>(null);
  const [crewLoading, setCrewLoading] = useState(false);
  const [diningYachtId, setDiningYachtId] = useState(PRESET_YACHTS[0].id);
  const [diningResult, setDiningResult] = useState<DiningResult | null>(null);
  const [diningLoading, setDiningLoading] = useState(false);
  const [recYachtId, setRecYachtId] = useState(PRESET_YACHTS[0].id);
  const [recResult, setRecResult] = useState<TestResult | null>(null);
  const [recLoading, setRecLoading] = useState(false);

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

  async function runCrew(yachtId: string) {
    setCrewLoading(true);
    setError(null);
    setCrewResult(null);
    try {
      const response = await fetch(`/api/cya-crew-diagnostic?yacht_ids=${encodeURIComponent(yachtId)}`, {
        headers: { "x-admin-token": token },
      });
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      setCrewResult({ status: response.status, ok: response.ok, body, yachtId });
    } catch {
      setError("The request to this website's server failed. Check your connection and try again.");
    } finally {
      setCrewLoading(false);
    }
  }

  async function runDining(yachtId: string) {
    setDiningLoading(true);
    setError(null);
    setDiningResult(null);
    try {
      const response = await fetch(`/api/cya-crew-diagnostic?yacht_ids=${encodeURIComponent(yachtId)}`, {
        headers: { "x-admin-token": token },
      });
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      setDiningResult({ status: response.status, ok: response.ok, body, yachtId });
    } catch {
      setError("The request to this website's server failed. Check your connection and try again.");
    } finally {
      setDiningLoading(false);
    }
  }

  async function runRecommendations(yachtId: string) {
    setRecLoading(true);
    setError(null);
    setRecResult(null);
    try {
      const response = await fetch(`/api/recommendation-diagnostic?yacht_id=${encodeURIComponent(yachtId)}`, {
        headers: { "x-admin-token": token },
      });
      const body = (await response.json().catch(() => ({}))) as Record<string, unknown>;
      setRecResult({ status: response.status, ok: response.ok, body });
    } catch {
      setError("The request to this website's server failed. Check your connection and try again.");
    } finally {
      setRecLoading(false);
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

      <section className="mb-8 rounded-lg border border-[#061625]/10 bg-white p-6">
        <h2 className="mb-1 font-display text-lg italic text-[#061625]">Yacht crew-profile tester</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#061625]/70">
          Fetches the yacht&apos;s full CYA detail record and reports every crew field it carries, the exact
          field paths the website reads, how many crew profiles were parsed, and whether anything in CYA is
          being left off the public Meet Your Crew section. Contact details inside values are redacted.
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
            disabled={crewLoading || !token || !yachtIdInput.trim()}
            onClick={() => runCrew(yachtIdInput.trim())}
            className="shrink-0 rounded-full bg-[#061625] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#061625]/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {crewLoading ? "Testing…" : "Test Crew Profiles"}
          </button>
        </div>

        {crewResult && (
          <div className="mt-5" aria-live="polite">
            {!crewResult.ok ? (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                Crew tester request failed (server response {crewResult.status}).
                {typeof crewResult.body.error === "string" ? ` ${crewResult.body.error}` : ""}
              </p>
            ) : (
              <CrewReport body={crewResult.body} />
            )}
          </div>
        )}
      </section>

      <section className="mb-8 rounded-lg border border-[#061625]/10 bg-white p-6">
        <h2 className="mb-1 font-display text-lg italic text-[#061625]">Similar-yacht recommendation tester</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#061625]/70">
          Runs the two-stage recommendation engine for one reference yacht: the derived reference profile
          (class, unit-normalised length, guests, cabins, published pricing, seasonal regions), how many
          catalogue records were considered, exclusions grouped by rule, the eligible set, and the ranked
          strict and broader matches with per-factor scores. Reuses the shared cached catalogue — no extra
          CYA requests beyond the detail record.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESET_YACHTS.map((y) => (
            <button
              key={y.id}
              type="button"
              onClick={() => setRecYachtId(y.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                recYachtId === y.id
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
            value={recYachtId}
            onChange={(e) => setRecYachtId(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border border-[#061625]/20 bg-white px-4 py-3 font-mono text-sm text-[#061625] focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
            placeholder="CYA yacht id"
          />
          <button
            type="button"
            disabled={recLoading || !token || !recYachtId.trim()}
            onClick={() => runRecommendations(recYachtId.trim())}
            className="shrink-0 rounded-full bg-[#EE9739] px-6 py-3 text-sm font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {recLoading ? "Testing…" : "Test Recommendations"}
          </button>
        </div>

        {recResult && (
          <div className="mt-5" aria-live="polite">
            {!recResult.ok ? (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                Recommendation tester request failed (server response {recResult.status}).
                {typeof recResult.body.error === "string" ? ` ${recResult.body.error}` : ""}
              </p>
            ) : (
              <pre className="max-h-[32rem] overflow-auto rounded-md bg-[#061625]/5 p-4 text-xs leading-relaxed text-[#061625]">
                {JSON.stringify(recResult.body, null, 2)}
              </pre>
            )}
          </div>
        )}
      </section>

      <section className="mb-8 rounded-lg border border-[#061625]/10 bg-white p-6">
        <h2 className="mb-1 font-display text-lg italic text-[#061625]">Yacht Dining &amp; Menu Tester</h2>
        <p className="mb-4 text-sm leading-relaxed text-[#061625]/70">
          Fetches the yacht&apos;s full CYA detail record and reports the raw menuDetails and menuGeneral
          fields, every recognized field path, the menu categories and food photographs parsed, what the
          public Dining &amp; Cuisine section receives, and any CYA fields our parser omits.
        </p>
        <div className="mb-4 flex flex-wrap gap-2">
          {PRESET_YACHTS.map((y) => (
            <button
              key={y.id}
              type="button"
              onClick={() => setDiningYachtId(y.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                diningYachtId === y.id
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
            value={diningYachtId}
            onChange={(e) => setDiningYachtId(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-md border border-[#061625]/20 bg-white px-4 py-3 font-mono text-sm text-[#061625] focus:outline-none focus:ring-2 focus:ring-[#EE9739]"
            placeholder="CYA yacht id"
          />
          <button
            type="button"
            disabled={diningLoading || !token || !diningYachtId.trim()}
            onClick={() => runDining(diningYachtId.trim())}
            className="shrink-0 rounded-full bg-[#EE9739] px-6 py-3 text-sm font-semibold text-[#061625] transition-colors hover:bg-[#EA6F33] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {diningLoading ? "Testing…" : "Test Dining & Menus"}
          </button>
        </div>

        {diningResult && (
          <div className="mt-5" aria-live="polite">
            {!diningResult.ok ? (
              <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
                Dining tester request failed (server response {diningResult.status}).
                {typeof diningResult.body.error === "string" ? ` ${diningResult.body.error}` : ""}
              </p>
            ) : (
              <DiningReport body={diningResult.body} />
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

const MENU_VERDICT_STYLES: Record<string, string> = {
  menu_delivered: "bg-green-50 text-green-800",
  parser_gap: "bg-[#EE9739]/15 text-[#061625]",
  no_source_data: "bg-[#061625]/5 text-[#061625]/80",
};

function DiningReport({ body }: { body: Record<string, unknown> }) {
  const yachts = (body.yachts ?? []) as MenuYachtReport[];
  if (yachts.length === 0) {
    return <p className="text-sm text-[#061625]/70">No yacht reports returned.</p>;
  }
  return (
    <div className="space-y-6">
      {yachts.map((y) => (
        <div key={y.yachtId} className="rounded-lg border border-[#061625]/10 p-4">
          <p className="text-sm font-semibold text-[#061625]">
            {y.yachtName ?? "Unknown yacht"} <span className="font-mono text-xs font-normal text-[#061625]/60">{y.yachtId}</span>
          </p>
          {y.error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">CYA request failed: {y.error}</p>}
          {y.menus && (
            <>
              <div className={`mt-3 rounded-md px-4 py-3 ${MENU_VERDICT_STYLES[y.menus.verdict.code] ?? "bg-[#061625]/5"}`}>
                <p className="text-sm font-semibold">{y.menus.verdict.headline}</p>
                {y.menus.verdict.explanation && (
                  <p className="mt-1 text-sm leading-relaxed opacity-90">{y.menus.verdict.explanation}</p>
                )}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-[#061625]/5 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">menuDetails</p>
                  <p className="text-[#061625]">
                    {y.menus.menuDetailsPresent ? `Present (${y.menus.menuDetailsType})` : "Absent"}
                  </p>
                </div>
                <div className="rounded-md bg-[#061625]/5 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">menuGeneral</p>
                  <p className="text-[#061625]">{y.menus.menuGeneralPresent ? "Present (object)" : "Absent"}</p>
                </div>
                <div className="rounded-md bg-[#061625]/5 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">Menu categories parsed</p>
                  <p className="text-lg text-[#061625]">{y.menus.categoryCount}</p>
                </div>
                <div className="rounded-md bg-[#061625]/5 p-3 text-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-[#061625]/60">Food photographs found</p>
                  <p className="text-lg text-[#061625]">{y.menus.photoCount}</p>
                </div>
              </div>

              {y.menus.categories.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#061625]">Menu categories delivered to the public page</p>
                  <ul className="mt-1 space-y-1 text-xs text-[#061625]/75">
                    {y.menus.categories.map((c, i) => (
                      <li key={i} className="break-words">
                        <span className="font-medium">{c.title}</span> — <span className="font-mono">{c.path}</span> ({c.bodyFormat})
                        {c.bodyPreview ? ` — ${c.bodyPreview}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {y.menus.photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#061625]">Food photographs delivered</p>
                  <ul className="mt-1 space-y-1 text-xs text-[#061625]/75">
                    {y.menus.photos.map((p, i) => (
                      <li key={i} className="break-all">
                        <span className="font-mono">{p.path}</span>
                        {p.description ? ` — ${p.description}` : ""} —{" "}
                        <span className="text-[#337891]">{p.url}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {y.menus.general && (y.menus.general.descriptionText || y.menus.general.photo) && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#061625]">General dining description delivered</p>
                  {y.menus.general.photo && (
                    <p className="mt-1 break-all text-xs text-[#061625]/75">
                      <span className="font-mono">{y.menus.general.photo.path}</span> — {y.menus.general.photo.url}
                    </p>
                  )}
                  {y.menus.general.descriptionText && (
                    <p className="mt-1 text-xs italic text-[#061625]/70">{y.menus.general.descriptionText.slice(0, 220)}…</p>
                  )}
                </div>
              )}

              {y.menus.omittedFields.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-[#EA6F33]">Fields present in CYA but omitted by the parser</p>
                  <ul className="mt-1 space-y-1 font-mono text-xs text-[#061625]/75">
                    {y.menus.omittedFields.map((f) => (
                      <li key={f.path} className="break-words">
                        {f.path} ({f.type}){f.preview ? ` — ${f.preview}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const VERDICT_STYLES: Record<string, string> = {
  crew_parsed: "bg-green-50 text-green-800",
  parser_gap: "bg-[#EE9739]/15 text-[#061625]",
  no_crew_data: "bg-[#061625]/5 text-[#061625]/80",
};

function CrewReport({ body }: { body: Record<string, unknown> }) {
  const yachts = (body.yachts ?? []) as CrewYachtReport[];
  if (yachts.length === 0) {
    return <p className="text-sm text-[#061625]/70">No yacht reports returned.</p>;
  }
  return (
    <div className="space-y-6">
      {yachts.map((y) => (
        <div key={y.yachtId} className="rounded-lg border border-[#061625]/10 p-4">
          <p className="text-sm font-semibold text-[#061625]">
            {y.yachtName ?? "Unknown yacht"} <span className="font-mono text-xs font-normal text-[#061625]/60">{y.yachtId}</span>
          </p>
          {y.error && <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">CYA request failed: {y.error}</p>}
          {y.verdict && (
            <div className={`mt-3 rounded-md px-4 py-3 ${VERDICT_STYLES[y.verdict.code] ?? "bg-[#061625]/5"}`}>
              <p className="text-sm font-semibold">{y.verdict.headline}</p>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{y.verdict.explanation}</p>
            </div>
          )}

          {y.members && y.members.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-sm font-semibold text-[#061625]">Parsed crew ({y.parsedCount})</p>
              {y.members.map((m, i) => (
                <div key={i} className="rounded-md border border-[#061625]/10 p-3 text-sm">
                  <p className="font-medium text-[#061625]">
                    {m.name} — {m.role}
                  </p>
                  <p className="mt-0.5 text-xs text-[#061625]/70">
                    Biography: {m.bioPresent ? "present" : "none"} · Photo: {m.photoUrl ? "present" : "none"}
                    {m.nationality ? ` · Nationality: ${m.nationality}` : ""}
                    {m.languages ? ` · Languages: ${m.languages}` : ""}
                    {m.qualifications ? ` · Qualifications: ${m.qualifications}` : ""}
                    {m.culinaryBackground ? " · Culinary background: present" : ""}
                    {m.interests ? ` · Interests: ${m.interests}` : ""}
                  </p>
                  {m.bioPreview && <p className="mt-1 text-xs italic text-[#061625]/60">{m.bioPreview}</p>}
                  {m.photoUrl && (
                    <p className="mt-1 break-all text-xs text-[#337891]">{m.photoUrl}</p>
                  )}
                  {m.paths && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-medium text-[#061625] underline underline-offset-4">
                        Field paths used
                      </summary>
                      <ul className="mt-1 space-y-0.5 font-mono text-xs text-[#061625]/70">
                        {Object.entries(m.paths)
                          .filter(([, p]) => p !== null)
                          .map(([field, p]) => (
                            <li key={field}>{`${field}: ${p}`}</li>
                          ))}
                      </ul>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}

          {y.fieldPathsUsed && y.fieldPathsUsed.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-[#061625] underline underline-offset-4">
                All field paths used by the parser
              </summary>
              <ul className="mt-1 space-y-0.5 font-mono text-xs text-[#061625]/70">
                {y.fieldPathsUsed.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </details>
          )}

          {y.crewShapedRawFields && y.crewShapedRawFields.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-[#061625]">Crew-shaped fields in the raw CYA record</p>
              <ul className="mt-1 space-y-1 text-xs text-[#061625]/75">
                {y.crewShapedRawFields.map((f) => (
                  <li key={f.key} className="break-words">
                    <span className="font-mono">{f.key}</span> ({f.type}){" "}
                    <span className={f.matched ? "text-green-700" : "text-[#EA6F33]"}>
                      {f.matched ? "recognized by parser" : "NOT recognized by parser"}
                    </span>
                    {f.preview ? ` — ${f.preview}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {y.omittedData && y.omittedData.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-[#EA6F33]">Data CYA supplies that the website omits</p>
              <ul className="mt-1 space-y-1 font-mono text-xs text-[#061625]/75">
                {y.omittedData.map((f) => (
                  <li key={f.path} className="break-words">
                    {f.path} ({f.type}){f.preview ? ` — ${f.preview}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {y.delivered && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-[#061625]">Delivered to the public Meet Your Crew section</p>
              {y.delivered.length === 0 ? (
                <p className="mt-1 text-sm text-[#061625]/70">Nothing — the section is hidden for this yacht.</p>
              ) : (
                <ul className="mt-1 space-y-1 text-xs text-[#061625]/75">
                  {y.delivered.map((m, i) => (
                    <li key={i}>
                      {m.name} — {m.role} ({m.source}): biography{" "}
                      {m.bioPresent ? `${m.bioCharacters ?? "?"} characters` : "none"}, photo{" "}
                      {m.photoPresent ? "present" : "none"}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {y.allTopLevelFields && (
            <details className="mt-4">
              <summary className="cursor-pointer text-xs font-medium text-[#061625] underline underline-offset-4">
                All top-level fields in the raw response ({y.allTopLevelFields.length})
              </summary>
              <p className="mt-1 break-words font-mono text-xs text-[#061625]/60">{y.allTopLevelFields.join(", ")}</p>
            </details>
          )}
        </div>
      ))}
      <details>
        <summary className="cursor-pointer text-sm font-semibold text-[#061625]">Full diagnostic payload</summary>
        <pre className="mt-3 max-h-96 overflow-auto rounded bg-[#061625] p-3 text-xs leading-relaxed text-[#f5f0e8]">
          {JSON.stringify(body, null, 2)}
        </pre>
      </details>
    </div>
  );
}

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
