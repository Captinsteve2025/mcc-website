# MCC Website — Product Improvement Register

Status progression: Identified → In Progress → Implemented → Deployed → Production-Verified → Approved for Launch.
Live site: https://mcc-website-one.vercel.app/ (deploys from the `collaborate` branch after sync).

> Note (this session): an earlier version of this register was lost in a sandbox
> reset and was recreated below. Production-verified statuses that predate this
> recreation are re-stated from session records; anything not yet re-verified in
> production is marked accordingly.

## Verified production facts (unchanged)

| Fact | Status |
| --- | --- |
| Dining section: 9 EH accordions, 0 empty, 0 entity artifacts, content integrity 6,330 chars in/out | Production-Verified (screenshots in `test-results/dining-verification/`, script lost in reset — re-promote before next CI pass) |
| Collapsed dining heights: desktop 1,669px / mobile 2,724px vs targets <1,600 / <2,200 | Open — both missed; mobile worst (~24% over). Mobile carousel + reduced spacing shipped this session, not yet production-measured |
| Calendar id mapping (confirmed bookings → Booked, active holds → Hold, transit → Transit, else Unavailable, empty ≠ available) | Production-Verified |
| CYA endpoints: base already ends `/api/v1`; `/bookings?yacht_id=` primary; legacy mapping only on 404 | Production-Verified |

## Register entries (current cycle)

### 1. Premium pricing & conversion design (hero + panel + persistent bar) — Implemented, awaiting deploy
- Hero headline pricing from one shared source (`src/lib/yacht-pricing.ts`): range `$X – $Y / week` when seasons differ, `From $X / week` otherwise, `Rates on request` when CYA supplies nothing. Never zero, never invented, never converted across currencies.
- Primary CTA "Enquire About This Yacht" (peach #EE9739); secondary outlined "View Rates & Availability" scrolls to the panel.
- "Plan Your Charter — Rates & Availability" panel: desktop 2-col (pricing left, live calendar right, expandable "View Full Charter Rates & Terms" — no rate-table duplication); mobile stacked headline rate → seasonal summary → calendar → expandable terms → CTA.
- CYA fields actually supplied and used: `seasons[]` (title, season_category, dates, base_price, currency, areas, pickup, base_port, charter_type, terms) and `min_price_usd`. Christmas/New-Year, APA, taxes, guest-number pricing and all-inclusive-vs-plus-expenses distinction render **only when a season's own terms/notes carry them** — CYA supplies no dedicated structured fields for these, so none are fabricated.
- Persistent mobile bar (`YachtPersistentBar`): same headline rate, appears after hero scroll, hides near the enquiry form, safe-area inset. Desktop: no floating panel; compact sidebar/nav left as-is (existing sticky nav carries pricing via nav item).

### 2. Page hierarchy & navigation — Implemented, awaiting deploy
- Order: hero (name, rate, CTAs) → gallery + quick specs → sticky nav → Rates & Availability panel → Overview + Accommodation + Specifications (beside sticky enquiry) → Experiences (watersports) → Crew → Dining → Amenities → booking conditions → recommendations → footer.
- Nav labels: Overview / Rates & Availability / Accommodation / Crew / Dining / Experiences / Gallery / Amenities / Enquire (Gallery & Amenities only when data present; Specifications appears only when specs exist).

### 3. Crew redesign — Implemented, awaiting deploy
- Compact cards: consistent 4:3 portrait, name, verified role, ≤220-char preview + "Read Full Biography" expansion (event `yacht_crew_bio_expand`).
- Desktop grid: 2 crew → 2-col pairing; larger crews → 2-col, 3-col on wide screens. Mobile: compact stack. No fabricated roles; captain/chef ordering driven only by verified role text.

### 4. Dining mobile refinements — Implemented, awaiting deploy
- Mobile photo carousel (swipeable, snap, partial next-photo preview) replacing the 1-col grid; captions kept.
- Reduced vertical spacing; "restaurant-menu" typography (62ch measure, Playfair initial) inside expanded panels; 9 EH categories unchanged; no empty accordions; Sample Menu fallback preserved.
- Height correction recorded: baselines stand at desktop 1,669px / mobile 2,724px (register previously overstated both misses); production re-measure required after deploy.

### 5. React hydration #418 — Root cause fixed, awaiting deploy
- Root cause: `YachtAvailabilityCalendar` chose 1 vs 3 visible months from `window.innerWidth` during the first client render. Server rendered 3; mobile clients re-rendered 1 → hydration mismatch (args containing HTML).
- Fix: always render 3 months server-side; months 2–3 hidden on mobile via CSS. No suppression. Verify in production on mobile after deploy.

### 6. Intelligent similar-yacht recommendations — Implemented, awaiting deploy
- "Discover More Exceptional Yachts" after enquiry, before footer; "Explore All Charter Yachts" CTA. 3 cards desktop, swipeable partial-preview carousel mobile.
- Deterministic scorer (`src/lib/similar-yachts.ts`) over the CYA catalogue rows already cached server-side — no extra CYA request per load. Weights: pricing 30%, region 25%, type 20%, guests 15%, length 10% (`SIMILARITY_WEIGHTS`, centrally configurable).
- Pricing compared only like-for-like (USD-normalised when both supply `min_price_usd`, else same-currency); missing data excluded from the weighted sum, never zero. Self, duplicates and inactive records excluded.
- Cards: photo, name, type, length, guests, cabins, starting rate or "Rates on request", "Explore Yacht" link. Server-rendered crawlable links, lazy-loaded images.
- **Managed-fleet preference: not applied.** The only reliable managed mapping remains aquanimity/atlas (managed pages, not CYA catalogue members); CYA catalogue records carry no managed flag, and name-based inference is prohibited. Constants `MANAGED_FLEET_SLUGS`/`MANAGED_FLEET_BOOST` are defined for when a reliable mapping exists.
- Verification of scores/recommendations for the 4 known CYA yachts is pending deploy (live API unreachable from dev).

### 7. Future analytics events (documented, NOT implemented)
- `yacht_hero_enquiry_click`, `yacht_rates_nav_click`, `yacht_pricing_panel_interact`, `yacht_guest_count_select`, `yacht_rates_expand`, `yacht_calendar_interact` (beyond existing `yacht_availability_view` / `yacht_availability_date_select`), `yacht_persistent_bar_click`, `yacht_crew_bio_expand` (implemented), `yacht_menu_expand`, `yacht_gallery_interact`, `enquiry_submit`, booking attribution (`utm`-carried enquiry context).

## Boundaries honoured this cycle
No changes to the enquiry system, database config, email/SMTP, CYA booking integration, SEO migration, WordPress redirects or CYA API credentials.
