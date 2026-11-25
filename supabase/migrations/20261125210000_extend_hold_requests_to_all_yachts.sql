begin;

alter table public.yacht_hold_requests
  add column yacht_name text check (char_length(yacht_name) between 1 and 200),
  drop constraint yacht_hold_requests_yacht_id_check,
  drop constraint yacht_hold_requests_guest_count_check,
  add constraint yacht_hold_requests_yacht_id_check check (
    yacht_id ~ '^[a-fA-F0-9]{8,32}$' or yacht_id ~ '^managed:[a-z0-9][a-z0-9-]{0,79}$'
  ),
  add constraint yacht_hold_requests_guest_count_check check (guest_count between 1 and 100);

update public.yacht_hold_requests
set yacht_name = 'OHANA'
where yacht_id = '6a023755ce6b8709506dfee5';

-- The original function remains callable by the deployed OHANA form during rollout.
-- Its locks, quotas and duplicate checks also protect requests from the new form.
create function public.submit_fleet_hold_request(
  p_id uuid,
  p_yacht_id text,
  p_yacht_name text,
  p_start_date date,
  p_end_date date,
  p_guest_count integer,
  p_full_name text,
  p_email text,
  p_requester_hash text
) returns text
language plpgsql set search_path = public
as $$
declare
  result text;
begin
  if p_yacht_name is null or btrim(p_yacht_name) = '' then
    raise exception 'A yacht name is required';
  end if;

  result := public.submit_yacht_hold_request(
    p_id, p_yacht_id, p_start_date, p_end_date, p_guest_count, p_full_name, p_email, p_requester_hash
  );
  if result = 'saved' then
    update public.yacht_hold_requests
    set yacht_name = p_yacht_name
    where id = p_id and yacht_name is null;
  end if;
  return result;
end;
$$;

revoke all on function public.submit_fleet_hold_request(uuid, text, text, date, date, integer, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_fleet_hold_request(uuid, text, text, date, date, integer, text, text, text)
  to service_role;

commit;
