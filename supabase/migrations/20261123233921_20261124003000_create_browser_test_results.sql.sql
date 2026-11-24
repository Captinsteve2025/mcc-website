/*
# Browser test results for the production health monitor

1. New Tables
- `browser_test_results` — one row per completed browser-verification run of a
  yacht page, produced by an external Playwright harness (run manually from a
  workstation or by GitHub Actions after each deployment) and imported into the
  `/admin/site-health` dashboard.
  - `id` (uuid, primary key, default gen_random_uuid())
  - `ran_at` (timestamptz, not null, default now()) — when the browser test executed
  - `commit_sha` (text, nullable) — deployed commit the test ran against
  - `deployment_id` (text, nullable) — Vercel deployment identifier (e.g. dpl_...)
  - `yacht_id` (text, not null) — CYA yacht id the page was tested for
  - `yacht_name` (text, nullable) — display name at test time
  - `viewport` (text, not null) — "desktop" or "mobile"
  - `passed` (boolean, not null) — true when every executed check succeeded
  - `tests_total` (integer, not null) — number of checks executed
  - `tests_failed` (integer, not null) — number of checks that failed
  - `broken_images` (integer, not null, default 0) — images that failed to load
  - `failures` (jsonb, not null, default '[]') — array of human-readable failure descriptions
  - `browser_errors` (jsonb, not null, default '[]') — array of console/page errors captured
  - `runner` (text, not null) — e.g. "playwright-github-actions" or "playwright-local"
  - `report_url` (text, nullable) — optional link to the full test report artifact

2. Security
- Enable RLS on `browser_test_results`. No public policies: the table holds
  internal verification data and is read/written only by the site-health
  server code with the service-role key.
- Grant SELECT, INSERT, DELETE to `service_role` only.

3. Notes
- Idempotent: CREATE TABLE IF NOT EXISTS.
- Pruning of rows older than 90 days is performed by the importer endpoint,
  mirroring site_health_runs.
*/

CREATE TABLE IF NOT EXISTS browser_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  commit_sha text,
  deployment_id text,
  yacht_id text NOT NULL,
  yacht_name text,
  viewport text NOT NULL,
  passed boolean NOT NULL,
  tests_total integer NOT NULL,
  tests_failed integer NOT NULL,
  broken_images integer NOT NULL DEFAULT 0,
  failures jsonb NOT NULL DEFAULT '[]'::jsonb,
  browser_errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  runner text NOT NULL,
  report_url text
);

ALTER TABLE browser_test_results ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON browser_test_results TO service_role;
