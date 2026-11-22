/*
# Lock down public access to availability and crew tables

1. Purpose
- The yacht detail pages only READ availability ranges and published crew
  profiles through the public (anon) key. Content changes are made by the
  site administrator using privileged (service-role) access, never through
  the public site.

2. Security changes
- `yacht_availability`: the earlier grant gave anon and authenticated all
  CRUD verbs. RLS only allowed reading, but the grants were wider than the
  policy. This migration revokes INSERT, UPDATE and DELETE from both roles
  and keeps SELECT only. RLS stays enabled with the existing public read
  policy.
- `yacht_crew`: same tightening — revoke INSERT, UPDATE, DELETE from anon
  and authenticated, keep SELECT (RLS already limits rows to
  `published = true`).
- No columns, rows or table structures are changed; no data is affected.

3. Notes
- Writes remain possible for the site administrator through the
  service-role connection, which is not exposed to browsers.
- This migration is idempotent: re-running produces the same result.
*/

REVOKE INSERT, UPDATE, DELETE ON yacht_availability FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON yacht_crew FROM anon, authenticated;

GRANT SELECT ON yacht_availability TO anon, authenticated;
GRANT SELECT ON yacht_crew TO anon, authenticated;
