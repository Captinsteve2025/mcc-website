-- Catalogue yacht proposals include this column in the existing public insert.
grant insert (cya_yacht_id) on public.yacht_enquiries to anon, authenticated;
