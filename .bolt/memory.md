# Project memory

## Product intent & audience

- "Aquanimity" project: yacht charter/listing site with individual vessel pages.
- Site has a live yacht catalogue; navigation distinguishes charter yachts from managed yachts.
- Catalogue reachable from every page via main navigation (desktop + mobile).
- Public availability calendar on vessel pages shows booking status from CYA (Central Yacht Agent) API.

## Brand personality & voice

- Nautical / sailing context; project name "Aquanimity" suggests calm-water themes.

## Visual design & UX direction

- Vessel pages feature a hero section and a social share (Open Graph) image; hero and share images can point to the same asset.
- Hero section supports video backgrounds: muted, looping autoplay with the photo shown first while the video loads.
- A semi-transparent dark-blue tint overlays the hero video to keep white headline/buttons readable; removing it would require text changes.
- Desktop navigation: "All Charter Yachts" link to live catalogue (replaced old "Browse Yachts" which lacked live inventory).
- Mobile menu: "All Charter Yachts" appears above "Managed Yachts".
- Availability calendar: confirmed bookings → Booked, active holds → Hold (expired holds dropped), transit → Transit, other → Unavailable, no record → unmarked/unknown. Empty bookings array never displayed as "available".

## Decisions, constraints & rationale

- Framework: Next.js.
- Menu link changed from "Browse Yachts" (dead/static page) to "All Charter Yachts" (live catalogue) in both desktop and mobile menus per user request.
- ffmpeg not installed; video compression unavailable; original-size assets used as-is.
- Reused Aquanimity site's existing hero video as page background per user request; rights to reuse not yet confirmed.
- Transient build errors (EAGAIN) on file-system ops recur; resolve on retry (sleep 30-40s then rebuild).
- Deployment workflow: sync to `collaborate` branch and redeploy.
- CYA API base URL `https://api.centralyachtagent.com/public/api/v1` already includes `/api/v1`; code was incorrectly appending `/api/v1` again, causing 404s. Fixed via centralized URL-builder function that strips accidental duplicate prefixes.
- Catalogue yacht IDs (e.g. ENDLESS HORIZON `69f33df0b5a1600bf785869e`) are valid for the CYA bookings API and used directly; legacy-ID mapping is only a fallback on 404.
- Production diagnostic updated to use corrected endpoints, report full request URLs, and label old broken route as alternate.
- API key lives only in Vercel environment; live API calls cannot be run from dev/build — must test via deployed diagnostic.
- XANDROS yacht CYA id not yet confirmed; supplied via PLAYWRIGHT_XANDROS_ID (Playwright) / NEXT_PUBLIC_XANDROS_CYA_ID (admin presets) when known.

## Correct similar-yacht recommendation engine (M6, corrected)

- Old engine failed commercial acceptance (motor yachts and a 161 ft sail yacht recommended for an 80 ft sailing catamaran). Root causes: single 100-record catalogue page, no eligibility gates, missing-data score inflation, coarse type buckets, no unit conversion, no price band, forced top-3. See MCC_PRODUCT_IMPROVEMENT_REGISTER.md M5.
- Corrected engine (src/lib/similar-yachts.ts): Stage-1 hard eligibility (same class, ≥1 seasonal region overlap, ±25% price with currency comparability, ±25% length after m→ft, guests ≥ reference, uncertain types excluded) then Stage-2 ranking (pricing 30% / region+season 25% / class+model 20% / guests+cabins 15% / length 10%, neutral floor for unknowns, min score 0.35). Config in RECOMMENDATION_CONFIG.
- Fallback widens ONLY price/length tolerance (0.6/0.5); class, region, guests never relaxed; broader tier labelled distinctly; empty state gets premium CTA; fewer than 3 is honest.
- Full catalogue via shared per-instance snapshot (getCatalogueSnapshot): one walk of ~10 cached search pages (200/page) per 5-minute TTL, shared across all yacht pages, diagnostic and concurrent visitors; failed walk clears cache and the section degrades to nothing (page still renders).
- Pricing comparability: USD floor vs USD floor (min_price_usd both sides), else same-currency only; missing rates never qualify; seasonal min-max range respected; basis (APA/all-inclusive) never invented — CYA has no per-record basis field.
- Visitor destination from catalogue query narrows the regional gate when present.
- Recommendations never imply calendar availability; copy states dates are re-confirmed personally.
- Admin diagnostic: /api/recommendation-diagnostic?yacht_id= (x-admin-token; tester card in /admin/api-test) reports reference profile, catalogue pages/records, exclusions per rule, eligible count, ranked scores, calculationMs, strict vs broader.
- Production verification pending deploy: EH, MISCHIEVOUS, OHANA, VIVA LA VIDA, XANDROS + edge cases. Not commercially approved until owner reviews.

## Mobile responsive defect (M7)

- XANDROS iPhone screenshot showed calendar/section background at ~69% viewport with text overflowing containers.
- Root cause: CSS grid columns default to min-width:auto — long unbroken CYA words forced content columns wider than viewport, squeezing the calendar column.
- Fix: min-w-0 on all three content-grid columns + break-words on CYA description/accommodation text; min-w-0 on rates panel and recommendation cards. No overflow hidden.
- Playwright now has a real WebKit project (mobile-webkit, iPhone 14) alongside Chromium; XANDROS responsive checks at 390/430 px verify no horizontal overflow, sections within viewport, calendar full width, persistent bar within viewport; screenshots uploaded as CI artifacts.

## Open questions & assumptions

- XANDROS CYA id unknown — needed to run the responsive checks in production and to add XANDROS to admin presets.
- Hull type discrepancy: Dufour 48 is generally a monohull, but source page says "catamaran" and provided photo shows a sailing catamaran. Needs user confirmation before publishing.
- Video reuse rights: asset copied from sailaquanimity.com — user must confirm licensing.
- Video hero behavior (especially on mobile) not yet verified in a browser; a compressed version would improve load performance.
- Live CYA bookings test for ENDLESS HORIZON (yacht ID `69f33df0b5a1600bf785869e`) not yet run — pending deployment to Vercel; diagnostic should report HTTP status, booking count, categories, dates, and calendar mapping.
- If first yacht returns empty bookings array, additional yacht IDs (up to six) should be tested to confirm genuine booking records.
