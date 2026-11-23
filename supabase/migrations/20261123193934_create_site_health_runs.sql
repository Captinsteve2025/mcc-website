/*
# Site health run history

1. New Tables
- `site_health_runs`
  - `id` (uuid, primary key, auto-generated)
  - `ran_at` (timestamptz, not null, defaults to now()) — when the check ran
  - `trigger` (text, not null) — "admin" (manual from the admin page) or "cron" (scheduled check)
  - `overall_status` (text, not null) — healthy / warning / failed / not_tested
  - `results` (jsonb, not null) — full per-check report payload
  - `commit_sha` (text, nullable) — deployed commit reported by the environment, when available
2. Security
- Enable RLS on `site_health_runs`.
- No SELECT grant to anon or authenticated: run history is admin-only and is read
  server-side with service credentials, which bypass RLS. No public policies are
  created — an anonymous visitor cannot read health history.
- Grants: SELECT and INSERT to service_role only (used by the health-check route).
3. Notes
- Old runs are pruned by the health route after inserting (keeps the 90 most recent),
  so the table stays small without a scheduled job.
*/

CREATE TABLE IF NOT EXISTS site_health_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at timestamptz NOT NULL DEFAULT now(),
  trigger text NOT NULL,
  overall_status text NOT NULL,
  results jsonb NOT NULL,
  commit_sha text
);

ALTER TABLE site_health_runs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON site_health_runs TO service_role;
