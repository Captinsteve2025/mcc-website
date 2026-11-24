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
- **Full catalogue with shared snapshot:** all pages walked through the shared cached client. Verification of the caching design (M6b below) confirmed the walk is shared per server instance, not per visitor.
- **Cards:** customer-friendly class label (no invented classifications), length in feet, guests, cabins, verified weekly rate with currency, cruising region, Explore Yacht CTA.
- **Admin diagnostic:** `/api/recommendation-diagnostic?yacht_id=` (admin token, `/admin/api-test` card) reports reference profile, catalogue pages and records considered, exclusions per rule, eligible count, ranked scores with reasons, calculation time, and relaxed-threshold usage.
- **Acceptance plan:** ENDLESS HORIZON first (expected profile derived, not hardcoded: sailing cat, ~60–100 ft, ~$65,250–$115,000/wk, ≥8 guests, ≥4 cabins preferred, BVI/Bahamas overlap), then MISCHIEVOUS, OHANA, VIVA LA VIDA, plus edge cases (smaller sailing cat, power cat, motor yacht, missing pricing, missing regions, no-suitable-alternatives). Live runs happen in production after deploy; the engine is **not commercially approved until the owner reviews the results**.

### M6b — Catalogue performance and caching verification (Shipped — verified in code; live figures pending deploy)
Findings from the corrected implementation:
- **CYA requests per complete catalogue:** ~10 search pages (200 records per page; ~1,920 yachts), within the per-instance 40 req/min guard and the CYA 60/min limit.
- **Shared across pages and visitors:** one catalogue snapshot per server instance. All yacht detail pages and the diagnostic await the same in-flight promise, so a burst of concurrent visitors triggers ONE walk, never one per visitor or per page.
- **Cache duration and refresh:** snapshot TTL 5 minutes (`catalogueTtlMs`); after expiry the next request refreshes it. Each page inside the walk is also cached twice over — Next Data Cache (revalidate 300) and the in-instance memory cache — so overlapping walks re-serve from those caches too.
- **Concurrent visitors:** the shared promise means the first request builds the snapshot while all concurrent requests await the same result. No thundering herd.
- **Cold vs warm:** cold cache ≈ 10 CYA round-trips (~1–3 s typical, rate-guarded); warm ≈ 0 CYA requests. Recommendation ranking over ~1,920 candidates is in-memory (milliseconds); the diagnostic reports `calculationMs`.
- **Page-failure behaviour:** a failed catalogue page (or walk) throws once, clears the shared snapshot, and the section is skipped for that render; the next request retries the walk. Yacht pages do not fail when the catalogue is unavailable — recommendations degrade to no section.
- **Page response impact:** the walk runs after the yacht's own detail/crew/availability fetches resolve and is cached shared, so warm-path page rendering adds only the in-memory ranking. Cold path adds the walk latency once per 5 minutes per instance.

### M6c — Pricing compatibility hardening (Shipped)
The mandatory pricing gate now:
- Compares USD floor price with USD floor price when CYA publishes both sides (`min_price_usd`), so different listing currencies never mix.
- Falls back to the listing's own weekly rate ONLY when the reference publishes the same currency — otherwise excluded as `price-missing`.
- Treats missing rates as non-comparable in every case: a candidate with no published rate never qualifies, and a reference with no rate fails all candidates. Missing pricing cannot pass as comparable.
- Respects seasonal pricing: the candidate's floor rate must fall inside the reference's seasonal min–max range widened by the tolerance, not a single figure.
- Pricing arrangement (all-inclusive vs plus-expenses/APA): CYA catalogue records carry no basis field and detail seasons carry only `charter_type` where the owner publishes it. The basis is reported in the diagnostic when CYA supplies it; no basis conversion is ever invented. CYA rates are whole-yacht weekly rates — no per-guest arrangement exists in the catalogue.

### M6d — Seasonal geographic relevance (Shipped)
- Regional gating and ranking already used each yacht's seasonal cruising areas, not flag/registration/builder. The catalogue's `seasonAreas` and the detail record's per-season `location_areas` are the only region sources.
- **Visitor destination hint (new):** when the visitor arrives from the catalogue with a destination selected, that destination narrows the regional gate — a Bahamas-bound visitor is never shown a yacht that only cruises elsewhere, even if the reference itself lists several regions. Derived from real user input only; never guessed.
- **No implied availability:** the recommendations section now states that recommended yachts' calendars are not checked against the visitor's dates and every date is re-confirmed personally. No booking data is fabricated for recommended yachts.

### M7 — Critical mobile responsive layout defect (Shipped — pending production verification)
XANDROS iPhone screenshot showed the calendar and section background occupying ~69% of the viewport with overview text and accommodation cards extending beyond containers. **Root cause found:** CSS grid columns size to their content's minimum width by default (`min-width: auto`), so long unbroken CYA description/accommodation words forced the content columns wider than the viewport, squeezing the adjacent calendar column to a fraction of its intended width and pushing section backgrounds past the viewport edge.
**Fix (root-cause, not concealment):**
- `min-w-0` on all three grid columns of the content layout (content, secondary, enquiry) so columns can shrink to their track instead of their content's minimum width.
- `break-words` + `min-w-0` on the overview description and accommodation description, so genuinely long CYA words wrap instead of stretching their container.
- `min-w-0` on the rates-panel columns and recommendation cards, and word-breaking on card titles/regions.
No overflow is hidden — the content itself now wraps correctly.
**Verification harness (extended):** Playwright config gains a real WebKit project (`mobile-webkit`, iPhone 14 device) alongside Chromium; the browser-verification spec gains XANDROS checks at 390 px and 430 px (iPhone 14 / 14 Pro Max widths): no horizontal overflow, all sections within the viewport, calendar at full column width, persistent bar within viewport, header usable. Screenshots captured per width and engine; the GitHub workflow installs WebKit and uploads the screenshots as artifacts. XANDROS's CYA id is supplied via `PLAYWRIGHT_XANDROS_ID` (tests) / `NEXT_PUBLIC_XANDROS_CYA_ID` (admin presets) until confirmed; the checks skip cleanly when absent. **Not commercially approved until the owner reviews the deployed page and screenshots.**

### M8 — Production recommendation & mobile verification (Planned — blocked on deploy)
After the user syncs to GitHub `collaborate` and Vercel deploys:
1. Run `/api/recommendation-diagnostic` in production for ENDLESS HORIZON, MISCHIEVOUS, OHANA, VIVA LA VIDA and XANDROS; record for each: catalogue records considered, per-rule exclusion counts, eligible count, final names with class, length, guests, cabins, weekly pricing, currency, seasonal regions, similarity scores, and strict vs broader tier. Include representative power cats, motor yachts and incomplete-data yachts from the exclusion sample.
2. Run the browser-verification workflow (now with WebKit) and review XANDROS screenshots at 390/430 px in both engines.
3. Neither recommendations nor mobile layout is marked commercially approved until the owner reviews the deployed website.

---

## Standing constraints
- Never fabricate CYA data; empty or unknown fields render as unknown, never as defaults.
- Deployment: user syncs to GitHub `mcc-website` `collaborate` branch → Vercel auto-deploy. Never deploy from the sandbox.
- Enquiry system, database config, SMTP, CYA booking integration, SEO migration and credentials are out of bounds.
- Managed-fleet preference (Aquanimity, Atlas) applies only after eligibility; commercial preference never overrides suitability.
- Permanent project documents (`MCC_PRODUCT_IMPROVEMENT_REGISTER.md`, project memory `.bolt/memory.md`) must be included in the GitHub sync.
