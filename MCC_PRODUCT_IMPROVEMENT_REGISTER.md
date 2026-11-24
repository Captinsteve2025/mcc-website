# MCC Product Improvement Register

Status progression: Identified → Planned → In development → Implemented → Deployed → Production verified → Visually approved → Approved for launch. An implemented component is not automatically complete. Where an interim solution is accepted, the intended premium solution is retained under "Outstanding refinements".

Assessment criteria are defined in `MCC_PRODUCT_STANDARDS.md`.

---

## Dining & Cuisine (yacht pages)

- **Component:** Dining section, `src/components/yacht/YachtDiningSection.tsx` + menu parsing in `src/lib/yacht-detail.ts`
- **Identified issue:** CYA's general menu description contained the entire written menu, which rendered as "introductory" text (~10,000px+ of visible menu content); photo-only CYA records created empty accordion panels; double-encoded entities (`&rsquo;`) were visible as literal text; a fabricated fallback intro line appeared when CYA supplied no text.
- **Proposed improvement:** Genuine three-part architecture: short genuine intro → food photography gallery → all written menu content inside collapsed accordions. Sections extracted from actual CYA headings (course-word detection, never hardcoded per yacht); single "Sample Menu" accordion fallback when extraction is unreliable; chef attribution from verified crew roles or explicit CYA menu content.
- **Commercial importance:** High — dining is a primary emotional sell for crewed charters and a key enquiry driver.
- **Development priority:** P1
- **Implementation status:** Implemented (menu/photography/accordion separation, entity decoding, chef attribution, empty-accordion elimination). Type-check and production build pass; parser verified against real CYA production content for ENDLESS HORIZON (all nine sections extracted, no dishes lost).
- **Production verification status:** Production verified (2026-11-24, Chromium, all four regression yachts, desktop + mobile). All written menus collapsed on load, 9/9 accordions populated, zero empty panels, zero visible entities, zero horizontal overflow, no fabricated fallback. ENDLESS HORIZON collapsed heights: desktop 1,669px (baseline 10,086px, −83%) / mobile 2,724px (baseline 12,829px, −79%). Screenshots in `test-results/dining-verification/`.
- **Visual approval status:** Not yet assessed — requires deployed production screenshots reviewed as a prospective guest.
- **Outstanding refinements:**
  - ENDLESS HORIZON desktop collapsed height is 1,669px vs the <1,600px target (mobile 2,724px meets the <2,200px target). Gap is ~70px of gallery chrome/labels — refine spacing, do not remove content.
  - React hydration error #418 reproduces on mobile page load (desktop runs were clean). Pre-existing, unrelated to dining; needs root-cause investigation.
  - Full keyboard-navigator walkthrough of accordion focus behaviour (Tab/Enter/Escape).
  - Restaurant-quality typography within expanded panels: stronger visual distinction between dish names and descriptions.
  - Concluding culinary/dietary statements currently embedded in the final section body; consider a distinct presentation if CYA content supports reliable detection.
  - Automated browser assertions for: no menu text visible on load, no empty panels, no visible entities, no horizontal overflow, collapsed-height targets. (Implemented in `scripts/verify-dining-production.mjs`; promote into the Playwright CI suite.)

## Crew presentation (yacht pages)

- **Component:** Crew section, `src/components/yacht/YachtCrewSection.tsx` + CYA crew parsing
- **Identified issue:** Crew profiles previously lost/raw HTML issues; now parsed from verified CYA fields (`crewDetails[].crewName/crewImage`, `crewGeneral.crewImage/crewDescription`) with allowlist HTML sanitization.
- **Proposed improvement:** Maintain verified-profile display with portrait photography and bios; no invented content.
- **Commercial importance:** High — crew rapport drives crewed-charter conversion.
- **Development priority:** P1
- **Implementation status:** Implemented.
- **Production verification status:** Deployed; earlier production pass confirmed profiles rendering with photos and bios.
- **Visual approval status:** Not formally assessed.
- **Outstanding refinements:** Visual review of layout consistency when a yacht has 1 vs 5+ crew.

## Yacht photography / hero gallery

- **Component:** `YachtHero.tsx`, `YachtHeroGallery.tsx`, `YachtPhoto.tsx`
- **Identified issue:** Original-size assets used as-is (no compression tooling in the build environment); video hero reuse rights unconfirmed (asset originates from sailaquanimity.com).
- **Proposed improvement:** Fast, premium hero with photo-first video fallback; confirm video licensing; compress oversized images.
- **Commercial importance:** High — hero imagery is the first commercial impression.
- **Development priority:** P1 (licensing) / P2 (compression)
- **Implementation status:** Implemented (photo-first hero, gallery mosaic).
- **Production verification status:** Deployed; page load verified in earlier production pass.
- **Visual approval status:** Not formally assessed.
- **Outstanding refinements:** Video rights confirmation; image compression; mobile video behaviour.

## Accommodation

- **Component:** Accommodation section in `src/app/charter-yachts/[id]/page.tsx` (`parseAccommodation`)
- **Identified issue:** Cabin/bathroom data presented as spec chips; free-text fields vary widely between yachts.
- **Proposed improvement:** Consistent premium presentation regardless of which CYA fields a yacht supplies.
- **Commercial importance:** Medium.
- **Development priority:** P2
- **Implementation status:** Implemented.
- **Production verification status:** Deployed.
- **Visual approval status:** Not formally assessed.
- **Outstanding refinements:** Guest-experience framing (not just counts); imagery where CYA supplies cabin photos.

## Watersports & toys

- **Component:** Watersports section (`parseWatersports`, tender separation)
- **Identified issue:** Previously merged tender with toys; bullet-entity artifacts.
- **Proposed improvement:** Tender highlighted separately; clean equipment grid.
- **Commercial importance:** Medium.
- **Development priority:** P2
- **Implementation status:** Implemented.
- **Production verification status:** Deployed.
- **Visual approval status:** Not formally assessed.
- **Outstanding refinements:** None identified.

## Availability calendar

- **Component:** `YachtAvailabilityCalendar.tsx` (CYA bookings feed)
- **Identified issue:** Mapping of CYA booking states (Booked/Hold/Transit/Unavailable) required correction; expired holds dropped.
- **Proposed improvement:** Live, trustworthy calendar visible on page load.
- **Commercial importance:** High — set-expectation tool that pre-qualifies enquiries.
- **Development priority:** P1
- **Implementation status:** Implemented.
- **Production verification status:** Deployed.
- **Visual approval status:** Not formally assessed.
- **Outstanding refinements:** Legend clarity on mobile.

## Charter rates

- **Component:** Rates section (`parseSeasons`)
- **Identified issue:** Seasonal rates and terms vary in structure; currency never assumed.
- **Proposed improvement:** Clear seasonal pricing with honest "indicative" framing and enquiry hand-off.
- **Commercial importance:** High — pricing transparency qualifies leads.
- **Development priority:** P1
- **Implementation status:** Implemented.
- **Production verification status:** Deployed.
- **Visual approval status:** Not formally assessed.
- **Outstanding refinements:** None identified.

## SEO & CYA indexing

- **Component:** Metadata, structured data, yacht name search
- **Identified issue:** Separate workstream (WordPress migration, CYA indexing); excluded from website-feature changes by standing instruction.
- **Proposed improvement:** Tracked here so SEO regressions are considered before any structural change to yacht pages.
- **Commercial importance:** High.
- **Development priority:** P1 (workstream B)
- **Implementation status:** Not in scope for this development cycle.
- **Production verification status:** n/a.
- **Visual approval status:** n/a.
- **Outstanding refinements:** Maintained in the SEO workstream.

## Conversion & enquiries

- **Component:** Enquiry form, sticky enquiry panel, CTA buttons
- **Identified issue:** Workstream C — enquiry infrastructure is excluded from website-feature changes by standing instruction.
- **Proposed improvement:** Recorded so design changes never degrade the enquiry path.
- **Commercial importance:** Highest — the enquiry is the website's revenue event.
- **Development priority:** P1 (workstream C)
- **Implementation status:** Not in scope for this development cycle.
- **Production verification status:** n/a.
- **Visual approval status:** n/a.
- **Outstanding refinements:** Owned by workstream C.

## Future commercial measurement (documented, NOT to be implemented in this cycle)

The website must ultimately support measurement of, per `MCC_PRODUCT_STANDARDS.md`'s commercial objective:

1. Yacht page engagement (scroll depth, time on page — hook exists: `useScrollDepthTracking`).
2. Photography gallery interactions (opens, lightbox use).
3. Crew profile interactions (expands, bio reads).
4. Menu expansions (which cuisine sections guests explore).
5. Availability calendar interactions (date selections).
6. Enquiry button clicks (all CTA variants — `TrackedCta` scaffolding exists).
7. Completed enquiries (workstream C).
8. Confirmed bookings (workstream C / CRM).
9. Revenue attributable to the website (attribution from enquiry → booking).

No analytics, enquiry infrastructure or database changes are to be implemented until explicitly instructed.
