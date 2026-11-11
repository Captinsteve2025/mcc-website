/*
# Create yacht enquiries table

1. New Tables
- `yacht_enquiries`: charter enquiries submitted from yacht landing pages (starting with ATLAS).
  - Public form fields: yacht_slug, yacht_name, full_name, email, phone, preferred_dates, flexible_dates, guest_count, special_occasion, additional_requests, marketing_opt_in, privacy_consent, lead_source, utm_params, landing_page_url.
  - Internal CRM fields (set by MCC staff only, never by visitors): status, assigned_broker, next_follow_up_date, booking_value_usd.
  - client_request_id: unique id generated per form session, used to prevent duplicate saves.

2. Security
- Row level security enabled.
- Visitors (anon and signed-in) may INSERT only the public fields. Internal CRM fields use their defaults.
- No SELECT, UPDATE or DELETE access is granted to visitors, so submitted enquiries cannot be read back or changed from the browser.

3. Notes
- Staff reads enquiries through the Supabase dashboard or a future authenticated back office.
*/

CREATE TABLE IF NOT EXISTS yacht_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_request_id uuid NOT NULL UNIQUE,
  yacht_slug text NOT NULL CHECK (char_length(yacht_slug) BETWEEN 1 AND 100),
  yacht_name text NOT NULL CHECK (char_length(yacht_name) BETWEEN 1 AND 100),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 254 AND email LIKE '%_@_%.__%'),
  phone text CHECK (phone IS NULL OR char_length(phone) BETWEEN 5 AND 40),
  preferred_dates text NOT NULL CHECK (char_length(preferred_dates) BETWEEN 1 AND 200),
  flexible_dates boolean NOT NULL DEFAULT false,
  guest_count integer NOT NULL CHECK (guest_count BETWEEN 1 AND 100),
  special_occasion text CHECK (special_occasion IS NULL OR char_length(special_occasion) <= 200),
  additional_requests text CHECK (additional_requests IS NULL OR char_length(additional_requests) <= 2000),
  marketing_opt_in boolean NOT NULL DEFAULT false,
  privacy_consent boolean NOT NULL CHECK (privacy_consent = true),
  lead_source text CHECK (lead_source IS NULL OR char_length(lead_source) <= 200),
  utm_params jsonb NOT NULL DEFAULT '{}'::jsonb,
  landing_page_url text CHECK (landing_page_url IS NULL OR char_length(landing_page_url) <= 2000),
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Follow-up Required', 'Booked', 'Lost')),
  assigned_broker text,
  next_follow_up_date date,
  booking_value_usd numeric(12, 2) CHECK (booking_value_usd IS NULL OR booking_value_usd >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS yacht_enquiries_yacht_slug_idx ON yacht_enquiries (yacht_slug);
CREATE INDEX IF NOT EXISTS yacht_enquiries_status_idx ON yacht_enquiries (status);

ALTER TABLE yacht_enquiries ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON yacht_enquiries FROM anon, authenticated;

GRANT INSERT (
  client_request_id, yacht_slug, yacht_name, full_name, email, phone,
  preferred_dates, flexible_dates, guest_count, special_occasion,
  additional_requests, marketing_opt_in, privacy_consent, lead_source,
  utm_params, landing_page_url
) ON yacht_enquiries TO anon, authenticated;

DROP POLICY IF EXISTS "anon_insert_yacht_enquiries" ON yacht_enquiries;
CREATE POLICY "anon_insert_yacht_enquiries" ON yacht_enquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);
