create table public.bvi_cabin_calendar_days (
  yacht_id text not null check (yacht_id in ('ipanema-58', 'lagoon-620')),
  starts_on date not null,
  status text not null check (status in ('available', 'limited', 'hold', 'booked')),
  rate_nights integer check (rate_nights between 1 and 30),
  rate_usd integer check (rate_usd between 1 and 100000),
  primary key (yacht_id, starts_on),
  check ((rate_nights is null) = (rate_usd is null))
);

alter table public.bvi_cabin_calendar_days enable row level security;
revoke all on public.bvi_cabin_calendar_days from public, anon, authenticated;
grant select, insert, update on public.bvi_cabin_calendar_days to service_role;
