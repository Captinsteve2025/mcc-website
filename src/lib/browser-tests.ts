import { createClient } from "@supabase/supabase-js";

// Browser verification results are produced OUTSIDE this deployment by a real
// browser harness (Playwright — run locally or through GitHub Actions after a
// Vercel deploy) and imported here. The health monitor only ever displays what
// an actual browser run observed; it never labels anything "fully verified"
// without a row in this table. Results older than 7 days are shown as stale.

export type BrowserTestResultRow = {
  ranAt: string;
  commitSha: string | null;
  deploymentId: string | null;
  yachtId: string;
  yachtName: string | null;
  viewport: "desktop" | "mobile";
  passed: boolean;
  testsTotal: number;
  testsFailed: number;
  brokenImages: number;
  failures: string[];
  browserErrors: string[];
  runner: string;
  reportUrl: string | null;
};

export type YachtBrowserVerification = {
  latest: BrowserTestResultRow | null;
  history: BrowserTestResultRow[];
  stale: boolean;
  error: string | null;
};

const MAX_AGE_MS = 7 * 86_400_000;
const MAX_ROWS = 40;

function rowToResult(row: Record<string, unknown>): BrowserTestResultRow {
  const arr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : []);
  return {
    ranAt: typeof row.ran_at === "string" ? row.ran_at : "",
    commitSha: typeof row.commit_sha === "string" ? row.commit_sha : null,
    deploymentId: typeof row.deployment_id === "string" ? row.deployment_id : null,
    yachtId: typeof row.yacht_id === "string" ? row.yacht_id : "",
    yachtName: typeof row.yacht_name === "string" ? row.yacht_name : null,
    viewport: row.viewport === "mobile" ? "mobile" : "desktop",
    passed: row.passed === true,
    testsTotal: typeof row.tests_total === "number" ? row.tests_total : 0,
    testsFailed: typeof row.tests_failed === "number" ? row.tests_failed : 0,
    brokenImages: typeof row.broken_images === "number" ? row.broken_images : 0,
    failures: arr(row.failures),
    browserErrors: arr(row.browser_errors),
    runner: typeof row.runner === "string" ? row.runner : "unknown",
    reportUrl: typeof row.report_url === "string" ? row.report_url : null,
  };
}

export async function importBrowserTestResult(
  input: BrowserTestResultRow
): Promise<{ stored: boolean; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return { stored: false, error: "Server database configuration is missing (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." };
  }
  const client = createClient(url, serviceKey);
  const { error } = await client.from("browser_test_results").insert({
    ran_at: input.ranAt || new Date().toISOString(),
    commit_sha: input.commitSha,
    deployment_id: input.deploymentId,
    yacht_id: input.yachtId,
    yacht_name: input.yachtName,
    viewport: input.viewport,
    passed: input.passed,
    tests_total: input.testsTotal,
    tests_failed: input.testsFailed,
    broken_images: input.brokenImages,
    failures: input.failures,
    browser_errors: input.browserErrors,
    runner: input.runner,
    report_url: input.reportUrl,
  });
  if (error) return { stored: false, error: error.message };
  // Keep the newest 90 days only — DELETE is granted to service_role only.
  await client
    .from("browser_test_results")
    .delete()
    .lt("ran_at", new Date(Date.now() - 90 * 86_400_000).toISOString());
  return { stored: true, error: null };
}

export async function getBrowserVerification(yachtIds: string[]): Promise<Record<string, YachtBrowserVerification>> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey || yachtIds.length === 0) {
    return Object.fromEntries(
      yachtIds.map((id) => [
        id,
        { latest: null, history: [], stale: false, error: !url || !serviceKey ? "not-configured" : "no-yachts" },
      ])
    );
  }
  const client = createClient(url, serviceKey);
  const { data, error } = await client
    .from("browser_test_results")
    .select("*")
    .in("yacht_id", yachtIds)
    .order("ran_at", { ascending: false })
    .limit(MAX_ROWS);
  const out: Record<string, YachtBrowserVerification> = {};
  for (const id of yachtIds) out[id] = { latest: null, history: [], stale: false, error: error ? error.message : null };
  if (error || !data) return out;
  for (const row of data) {
    const r = rowToResult(row as Record<string, unknown>);
    if (!out[r.yachtId]) continue;
    out[r.yachtId].history.push(r);
    if (out[r.yachtId].latest === null) {
      out[r.yachtId].latest = r;
      out[r.yachtId].stale = Date.now() - new Date(r.ranAt).getTime() > MAX_AGE_MS;
    }
  }
  return out;
}
