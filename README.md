# My Caribbean Charters

## Develop locally

Use Node.js 22 (see `.nvmrc`) and npm. Install from the committed lockfile.

```sh
nvm use
npm ci
npm run dev
```

Open http://localhost:3000. The homepage and managed-yacht pages run without provider credentials. For live catalogue and yacht details, copy `.env.example` to `.env.local` and fill in the approved CYA development settings. Set `CYA_ALLOWED_ORIGIN` to the origin registered for that integration, or omit it to use the application default. The Supabase settings are optional for curated crew and availability overrides. Keep keys in `.env.local` or the appropriate Vercel environment.

## Validate a change

```sh
npm run typecheck
npm run lint
npm run build
npm exec -- playwright install --with-deps chromium webkit
npm run test:browser
```

The browser suite starts the local production build on port 3170 and uses synthetic CYA responses. Desktop Chromium, mobile Chromium, and iPhone WebKit cover the catalogue-to-detail flow and a missing yacht. The suite needs no live provider credentials. To run just the Chromium profiles with a system browser, set `PLAYWRIGHT_LOCAL_CHROMIUM` to its executable path and run `npm run test:browser -- --project=desktop --project=mobile`.

The live suite is separate. Run `npm run test:browser:live` with `PLAYWRIGHT_BASE_URL` set to the intended Vercel preview or production URL. Set `PLAYWRIGHT_FULL=1` for all four sample yachts. Leave the import URL and token unset for a read-only run. Reports from both suites are written under `.playwright/`.

## Review and release

Open feature pull requests against `collaborate`. GitHub Actions runs the build and fixture checks for pull requests targeting `collaborate` or `main`. Confirm the configured production branch and Node version in Vercel before release. Use an approved Vercel preview for live-data checks against the exact commit. After an approved release, run the live checks and record the tested commit and results in the [product improvement register](MCC_PRODUCT_IMPROVEMENT_REGISTER.md).

### Charter proposal emails

Apply the [proposal email migration](supabase/migrations/20261125203000_add_yacht_proposal_email_delivery.sql) before deploying the form update. The server uses `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`), `SUPABASE_SERVICE_ROLE_KEY`, and `RESEND_API_KEY`. Confirm the Resend sending domain and the bookings mailbox against the [OHANA hold pilot](#ohana-hold-pilot) settings below.

The form saves the proposal in `yacht_enquiries` before sending the bookings notification and guest receipt. The two `proposal_*_email_id` fields record Resend acceptance. Guests can retry pending emails from the confirmation screen with the same reference. If delivery remains pending, use the saved proposal and Resend’s logs to reconcile it before sending manually. Existing proposals are preserved and do not trigger email automatically.

### OHANA hold pilot

Apply the [hold request migration](supabase/migrations/20261125193000_create_yacht_hold_requests.sql) to the intended Supabase project. Verify the sending domain `mycaribbeancharters.com` in Resend and confirm that `bookings@mycaribbeancharters.com` receives mail. Add `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` as server-side secrets in the intended Vercel environment, and use `SUPABASE_URL` or the existing `NEXT_PUBLIC_SUPABASE_URL` for that database. Set `HOLD_REQUESTS_ENABLED=true` when those checks are complete.

The form saves requests for broker review and sends a broker notification and guest acknowledgment. The broker checks availability and turnaround in CYA before placing a hold. If an email remains pending, the guest can retry from the receipt or an operator can call `POST /api/hold-requests/retry` with the existing `ADMIN_API_TOKEN` in the `x-admin-token` header. Reconcile pending records older than 23 hours with Resend before sending manually.
