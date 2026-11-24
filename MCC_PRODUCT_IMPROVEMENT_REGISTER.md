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

---

## Standing constraints
- Never fabricate CYA data; empty or unknown fields render as unknown, never as defaults.
- Deployment: user syncs to GitHub `mcc-website` `collaborate` branch → Vercel auto-deploy. Never deploy from the sandbox.
- Enquiry system, database config, SMTP, CYA booking integration, SEO migration and credentials are out of bounds.
- Managed-fleet preference (Aquanimity, Atlas) applies only after eligibility; commercial preference never overrides suitability.
