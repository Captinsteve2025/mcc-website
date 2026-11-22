/*
# Add full CYA yacht identifier to yacht enquiries

1. Modified Tables
- `yacht_enquiries`
  - New nullable column `cya_yacht_id` (text, up to 64 chars). Stores the FULL,
    untruncated Central Yacht Agent yacht identifier so every enquiry can be
    traced back to the exact yacht, even though the display slug remains the
    shorter `cya-<first12>` form.

2. Security
- No policy changes: the table already has RLS with anon INSERT-only access.
  The new column is written by the same INSERT the form already performs; it
  is not readable publicly (SELECT is not granted to anon).

3. Notes
- Nullable on purpose: existing managed-yacht enquiries have no CYA id.
- Indexed for the charter team to look up all enquiries for one yacht quickly.
*/

ALTER TABLE yacht_enquiries ADD COLUMN IF NOT EXISTS cya_yacht_id text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'cya_yacht_id_len'
  ) THEN
    ALTER TABLE yacht_enquiries ADD CONSTRAINT cya_yacht_id_len
      CHECK (char_length(cya_yacht_id) >= 1 AND char_length(cya_yacht_id) <= 64);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_yacht_enquiries_cya_yacht_id
  ON yacht_enquiries (cya_yacht_id)
  WHERE cya_yacht_id IS NOT NULL;
