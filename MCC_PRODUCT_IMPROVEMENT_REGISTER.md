# MCC Website — Product Improvement Register

Statuses: Shipped · Verified in production · Failed commercial acceptance · In progress · Planned

---

## Milestones

### M1 — CYA availability calendar (Shipped · Verified in production)
Public per-yacht availability from the CYA bookings feed: confirmed bookings → Booked, active holds → Hold (expired holds dropped), transit → Transit, other → Unavailable. Empty bookings are never shown as "available". Hydration fix: the calendar always renders three months, with the second and third hidden on mobile via CSS.

### M2 — Crew profiles (Shipped)
Admin-maintained MCC profiles merged with CYA-supplied crew; compact 4:3 cards, biography expand tracking (`yacht_crew_bio_expand`). Crew diagnostic in `/admin/api-test` distinguishes "CYA supplies no crew data" from "parser gap". Contact details redacted in diagnostics.

### M3 — Dining & menus (Shipped · Verified in production)
Dining & Cuisine section from CYA `menuDetails`/`menuGeneral`: categories, food photography, sample menus; mobile snap carousel. Field-mapping correction applied after production QA; menu diagnostic in `/admin/api-test`.

### M4 — Premium pricing & conversion design (Shipped)
"Plan Your Charter — Rates & Availability" panel directly under the hero gallery: published seasonal rates (unpriced seasons shown as "Rates on request" — nothing invented), full terms expander, live availability calendar beside the rates. Persistent bottom bar appears after the hero and hides at the enquiry form. Page hierarchy: hero → gallery + quick specs → section nav → rates panel → overview / accommodation / specifications beside sticky enquiry → amenities → booking conditions → persistent bar → recommendations → footer.

### M5 — Similar-yacht recommendations, original implementation — **FAILED COMMERCIAL ACCEPTANCE**
The first recommendation engine shipped but its results for ENDLESS HORIZON (YCM FIFTY 165 ft motor $172,800; TRINAKRIA ~161 ft sail $86,400; NO BAD IDEAS 160 ft motor $225,000) were rejected on commercial review: a motor yacht and a 161 ft sail yacht are not credible alternatives to an 80 ft sailing catamaran at ~$87k–$92k/week. Root causes established on review:
1. Only the first 100 of ~1,920 catalogue records were considered (single search page).
2. No Stage-1 eligibility gates — pure weighted ranking let class-mismatched yachts rank; a type mismatch cost only 20% weight.
3. Unknown factors were excluded from the weighted average, inflating scores for sparse records.
4. Coarse type normalisation conflated sailing cats, power cats and motor yachts.
5. No length-unit conversion (metres and feet treated as interchangeable).
6. No pricing band or currency/basis comparability check.
7. Guest capacity used a soft tolerance instead of "never below the reference party".
8. Top 3 were always forced (only bar: score > 0), so unsuitable yachts filled the row.

### M6 — Correct similar-yacht recommendation engine (Shipped — pending commercial acceptance)
Two-stage replacement, separate milestone from M5:
- **Stage 1 — mandatory eligibility (hard gates):** same genuine yacht class (sailing cat / power cat / sailing monohull / motor / motorsailer; uncertain types excluded, never guessed); ≥1 verified overlapping charter region from seasonal CYA areas (never Mediterranean-for-Caribbean); pricing within ±25% of the reference's published range with comparable currency (no invented conversions or APA; no published rate → excluded from strict); length within ±25% after unit normalisation (m→ft ×3.28084, units never assumed); guest capacity ≥ reference party size; self and duplicate records excluded.
- **Stage 2 — ranking of eligible yachts only:** pricing 30% / region+season 25% / class+model 20% / guests+cabins 15% / length 10%; unknown factors score at a neutral floor (missing data never inflates); minimum similarity threshold; weights and tolerances centrally configurable in `RECOMMENDATION_CONFIG`.
- **Controlled fallback:** fewer than three strict matches is an honest outcome. A controlled expansion widens ONLY price and length tolerance; class, region and guest gates are never relaxed; broader alternatives are labelled distinctly on the page; a premium "ask MCC" CTA covers the empty case.
- **Full catalogue:** all pages walked through the shared cached client (no single-page subset, no extra uncached CYA load).
- **Cards:** customer-friendly class label (no invented classifications), length in feet, guests, cabins, verified weekly rate with currency, cruising region, Explore Yacht CTA.
- **Admin diagnostic:** `/api/recommendation-diagnostic?yacht_id=` (admin token, `/admin/api-test` card) reports reference profile, records considered, exclusions per rule, eligible count, ranked scores with reasons, and relaxed-threshold usage.
- **Acceptance plan:** ENDLESS HORIZON first (expected profile derived, not hardcoded: sailing cat, ~60–100 ft, ~$65,250–$115,000/wk, ≥8 guests, ≥4 cabins preferred, BVI/Bahamas overlap), then MISCHIEVOUS, OHANA, VIVA LA VIDA, plus edge cases (smaller sailing cat, power cat, motor yacht, missing pricing, missing regions, no-suitable-alternatives). Live runs happen in production after deploy; the engine is **not commercially approved until the owner reviews the results**.

---

### Development stabilization (In progress)

Node 22, the npm lockfile, and the validation workflow define the development baseline. Fixture-based Playwright coverage checks the catalogue-to-detail flow on desktop and mobile, including iPhone WebKit. Live-data verification and production acceptance are pending.

### Mobile text overflow (In progress)

Reproduced horizontal overflow on the live ENDLESS HORIZON, MISCHIEVOUS, and OHANA pages and on the training page at 320 px. The yacht brochure now has a bounded mobile column and permits long source text to wrap. The training link can wrap within its card. Production verification is pending.

### Similar yachts on catalogue detail pages (Implemented)

Each CYA yacht detail page ranks up to three alternatives. The matcher preserves the published yacht category, requires a shared cruising region and sufficient capacity, and compares like-currency weekly base rates. When CYA publishes differently named pricing arrangements on both listings, the match is excluded. The closest matches use a 25% price and length band. Clearly labeled broader alternatives may fill available places within a 40% band. An empty result hides the section. Production and commercial acceptance are pending.

### Yacht detail page review (Implemented)

The shorter yacht header puts photography higher on the page. The calendar fits the number of months to its panel, and specification labels have a dedicated column. Fuel consumption appears when its unit is legible. Brochure checks exclude expired recommendation rates and use published age restrictions when comparing guest capacity. CUAN LAW's classification follows the operator's trimaran specification. Production and commercial acceptance are pending.

### CYA guest-count rates, reviews and charter guidance (Deployed)

The yacht detail page shows published weekly prices by season and guest count, a separate APA percentage, and guest reviews from the CYA detail response. The calendar flags short gaps around recorded bookings using the season’s turnaround hours. The proposal form uses published guest capacity, and the charter notes disclose minimum stays, age conditions, and holiday terms for broker confirmation. Desktop and mobile Chromium fixture checks and local OHANA detail replay passed. Vercel reported a successful deployment for commit `f8cb821` on `collaborate`. Production browser verification and commercial acceptance are pending.

### Request a hold (Deployed)

The yacht detail page displays a hold request panel immediately below the yacht availability calendar. It mirrors a complete date selection and clears it when the visitor starts choosing a new range. Submission is disabled pending the email backend. The local Chromium fixture suite passed on desktop and at 320 px mobile width, including date carryover, guest-count rates, guest reviews, and the turnaround advisory. Vercel reported a successful deployment for commit `55f9d3b` on `collaborate`. Production browser verification is pending.

The follow-up layout and handoff fix aligns the proposal with the availability panel and replaces the inactive hold button with a link to the existing proposal form. The proposal receives the selected dates. The production build and desktop and 320 px mobile Chromium fixture checks passed for this follow-up. Vercel verified that commit `3660080` is serving the production hostname. Production browser verification is pending.

The full hold request panel now uses MCC orange with navy text. The production build and desktop and mobile Chromium hold-to-proposal checks passed locally. Vercel verified that commit `a0684e8` is serving the production hostname. Production browser verification is pending.

### Charter proposal journey and yacht page hierarchy (Deployed)

The availability panel leads to a charter proposal with the selected dates. The form puts dates, party size, and contact details first, with optional trip details grouped separately. The confirmation summarizes the request and explains the availability check and follow-up. The yacht page gives the main photograph priority, places a CYA guest quote near the proposal, and leads with verified crew roles and portraits. Detailed specifications and the original crew notes remain available in expandable sections. The build and 12 desktop and mobile Chromium fixture checks passed. A mocked submission check verified failure, retry, and confirmation at desktop and 320 px mobile widths. Vercel verified that commit `d21a959` is serving the production hostname. Production browser verification is pending.

### OHANA broker-reviewed hold pilot (Deployed)

The orange hold panel below the calendar carries the selected dates into a dedicated OHANA form. The request is saved for broker review before Resend attempts the broker notification and guest acknowledgment. Both use `bookings@mycaribbeancharters.com` as sender and reply address. The form preserves the calendar’s turnaround warning and gives the guest a reference. A broker checks availability and places any hold in CYA after review. Desktop and 320 px mobile Chromium checks against local PostgreSQL and mocked CYA and Resend verified date carryover, receipt, email failure and retry, and duplicate prevention. The owner applied the production Supabase migration in SQL Editor and confirmed the table, both functions, and row-level security. Recording migration version `20261125193000` in Supabase’s migration history is pending. Production browser verification and live mailbox delivery remain pending.

Vercel reported commit `6dd1a52` on `collaborate` ready and assigned to the production hostname on November 25, 2026. A read-only Vercel fetch returned HTTP 200 with the orange hold panel and calendar instructions in the live OHANA page. A browser connection error prevented live interaction tests from this workspace.

The date-selection update is implemented locally. The calendar explains check-in, check-out, and month navigation. The orange block shows the first selected date, calls for a different checkout day, and reveals the form in place when both dates are selected. Its primary button reads **Request a hold**. Pricing and itinerary enquiries remain available through a text link to the proposal form. The calendar preserves the turnaround advisory. The build and desktop and 320 px mobile Chromium fixture checks passed. Deployment of this update is pending.

---

## Standing constraints
- Never fabricate CYA data; empty or unknown fields render as unknown, never as defaults.
- Deployment: user syncs to GitHub `mcc-website` `collaborate` branch → Vercel auto-deploy. Never deploy from the sandbox.
- Enquiry system, database config, SMTP, CYA booking integration, SEO migration and credentials are out of bounds.
- Managed-fleet preference (Aquanimity, Atlas) applies only after eligibility; commercial preference never overrides suitability.
