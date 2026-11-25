create table public.yacht_hold_requests (
  id uuid primary key,
  yacht_id text not null check (yacht_id = '6a023755ce6b8709506dfee5'),
  start_date date not null,
  end_date date not null check (end_date > start_date),
  guest_count integer not null check (guest_count between 1 and 12),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  privacy_consent boolean not null check (privacy_consent),
  requester_hash text not null,
  status text not null default 'pending_review' check (status in ('pending_review', 'placed', 'declined')),
  broker_email_id text,
  guest_email_id text,
  next_email_attempt_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.yacht_hold_requests enable row level security;
revoke all on public.yacht_hold_requests from public, anon, authenticated;
grant select, insert, update on public.yacht_hold_requests to service_role;
create index yacht_hold_requests_email_created_idx on public.yacht_hold_requests (email, created_at);
create index yacht_hold_requests_requester_created_idx on public.yacht_hold_requests (requester_hash, created_at);
create index yacht_hold_requests_pending_email_idx on public.yacht_hold_requests (next_email_attempt_at, created_at)
  where broker_email_id is null or guest_email_id is null;

create function public.submit_yacht_hold_request(
  p_id uuid,
  p_yacht_id text,
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
  existing public.yacht_hold_requests%rowtype;
begin
  perform pg_advisory_xact_lock(hashtextextended('hold-id:' || p_id::text, 0));
  select * into existing from public.yacht_hold_requests where id = p_id;
  if found then
    if (existing.yacht_id, existing.start_date, existing.end_date, existing.guest_count, existing.full_name, existing.email)
       is distinct from (p_yacht_id, p_start_date, p_end_date, p_guest_count, p_full_name, p_email) then
      return 'conflict';
    end if;
    return 'saved';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('hold-ip:' || p_requester_hash, 0));
  perform pg_advisory_xact_lock(hashtextextended('hold-email:' || p_email, 0));
  if (select count(*) from public.yacht_hold_requests where requester_hash = p_requester_hash and created_at > now() - interval '1 hour') >= 12
     or (select count(*) from public.yacht_hold_requests where email = p_email and created_at > now() - interval '1 hour') >= 4 then
    return 'rate_limited';
  end if;

  insert into public.yacht_hold_requests (
    id, yacht_id, start_date, end_date, guest_count, full_name, email, privacy_consent, requester_hash
  ) values (
    p_id, p_yacht_id, p_start_date, p_end_date, p_guest_count, p_full_name, p_email, true, p_requester_hash
  );
  return 'saved';
end;
$$;

revoke all on function public.submit_yacht_hold_request(uuid, text, date, date, integer, text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_yacht_hold_request(uuid, text, date, date, integer, text, text, text)
  to service_role;

create function public.claim_yacht_hold_email(p_id uuid)
returns setof public.yacht_hold_requests
language sql set search_path = public
as $$
  update public.yacht_hold_requests
  set next_email_attempt_at = now() + interval '1 minute'
  where id = p_id
    and next_email_attempt_at <= now()
    -- Resend's idempotency keys expire after 24 hours. Older unresolved
    -- delivery records require reconciliation before a manual send.
    and created_at > now() - interval '23 hours'
    and (broker_email_id is null or guest_email_id is null)
  returning *;
$$;

revoke all on function public.claim_yacht_hold_email(uuid) from public, anon, authenticated;
grant execute on function public.claim_yacht_hold_email(uuid) to service_role;
