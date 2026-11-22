/*
# Add yacht crew profiles and yacht availability tables

1. New Tables
- `yacht_crew`: MCC-admin-entered crew profiles for a CYA yacht, published
  only after approval. Columns: id, cya_yacht_id (full untruncated CYA id),
  name, role, bio, photo_url, nationality, languages, sort_order, published,
  updated_at.
- `yacht_availability`: MCC-maintained dated availability ranges per yacht
  (status: booked / hold / available / transit / unavailable) with an optional
  note, so the on-page calendar can show real confirmed dates with an accurate
  freshness timestamp.

2. Security
- RLS enabled on both tables.
- Public SELECT only for published crew rows (availability rows are facts and
  are readable; nothing private is stored in them).
- No INSERT/UPDATE/DELETE grants to anon or authenticated: content is written
  exclusively by the MCC admin interface through the service role.
- No personal contact data is stored; crew emails/phones are never published.
*/

CREATE TABLE IF NOT EXISTS yacht_crew (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cya_yacht_id text NOT NULL,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  role text NOT NULL CHECK (char_length(role) BETWEEN 1 AND 120),
  bio text CHECK (bio IS NULL OR char_length(bio) <= 4000),
  photo_url text CHECK (photo_url IS NULL OR photo_url ~* '^https://'),
  nationality text CHECK (nationality IS NULL OR char_length(nationality) <= 80),
  languages text CHECK (languages IS NULL OR char_length(languages) <= 200),
  sort_order integer NOT NULL DEFAULT 50,
  published boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_yacht_crew_yacht
  ON yacht_crew (cya_yacht_id, sort_order)
  WHERE published = true;

CREATE TABLE IF NOT EXISTS yacht_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cya_yacht_id text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('available','booked','hold','transit','unavailable')),
  note text CHECK (note IS NULL OR char_length(note) <= 300),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT yacht_availability_dates_ordered CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_yacht_availability_yacht
  ON yacht_availability (cya_yacht_id, start_date);

ALTER TABLE yacht_crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE yacht_availability ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published crew profiles" ON yacht_crew;
CREATE POLICY "Public can read published crew profiles"
ON yacht_crew FOR SELECT
TO anon, authenticated
USING (published = true);

DROP POLICY IF EXISTS "Public can read availability ranges" ON yacht_availability;
CREATE POLICY "Public can read availability ranges"
ON yacht_availability FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON yacht_crew TO anon, authenticated;
GRANT SELECT ON yacht_availability TO anon, authenticated;
