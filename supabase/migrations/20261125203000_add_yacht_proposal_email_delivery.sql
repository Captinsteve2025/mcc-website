alter table public.yacht_enquiries
  add column proposal_requester_hash text,
  add column proposal_broker_email_id text,
  add column proposal_guest_email_id text;

-- Match the form's existing insert-only grants on installations that have not applied the repair.
grant insert (cya_yacht_id) on public.yacht_enquiries to anon, authenticated;

create index yacht_proposals_requester_created_idx
  on public.yacht_enquiries (proposal_requester_hash, created_at)
  where proposal_requester_hash is not null;

create index yacht_proposals_email_created_idx
  on public.yacht_enquiries (lower(email), created_at)
  where proposal_requester_hash is not null;

grant select, insert, update on public.yacht_enquiries to service_role;

create function public.submit_yacht_proposal(p_enquiry jsonb, p_requester_hash text)
returns text
language plpgsql
set search_path = public
as $$
declare
  proposal public.yacht_enquiries := jsonb_populate_record(null::public.yacht_enquiries, p_enquiry);
  existing public.yacht_enquiries;
begin
  perform pg_advisory_xact_lock(hashtextextended('proposal-id:' || proposal.client_request_id::text, 0));
  select * into existing from public.yacht_enquiries where client_request_id = proposal.client_request_id;
  if found then
    if existing.proposal_requester_hash is null or lower(existing.email) is distinct from lower(proposal.email) then
      return 'conflict';
    end if;
    return 'saved';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('proposal-ip:' || p_requester_hash, 0));
  perform pg_advisory_xact_lock(hashtextextended('proposal-email:' || lower(proposal.email), 0));
  if (select count(*) from public.yacht_enquiries
      where proposal_requester_hash = p_requester_hash and created_at > now() - interval '1 hour') >= 12
    or (select count(*) from public.yacht_enquiries
        where proposal_requester_hash is not null and lower(email) = lower(proposal.email)
        and created_at > now() - interval '1 hour') >= 4 then
    return 'rate_limited';
  end if;

  insert into public.yacht_enquiries (
    client_request_id, yacht_slug, yacht_name, cya_yacht_id, full_name, email,
    phone, preferred_dates, flexible_dates, guest_count, special_occasion, additional_requests,
    marketing_opt_in, privacy_consent, lead_source, utm_params, landing_page_url, proposal_requester_hash
  ) values (
    proposal.client_request_id, proposal.yacht_slug, proposal.yacht_name, proposal.cya_yacht_id,
    proposal.full_name, proposal.email, proposal.phone, proposal.preferred_dates, proposal.flexible_dates,
    proposal.guest_count, proposal.special_occasion, proposal.additional_requests, proposal.marketing_opt_in,
    proposal.privacy_consent, proposal.lead_source, proposal.utm_params, proposal.landing_page_url, p_requester_hash
  );
  return 'saved';
end;
$$;

revoke all on function public.submit_yacht_proposal(jsonb, text) from public, anon, authenticated;
grant execute on function public.submit_yacht_proposal(jsonb, text) to service_role;
