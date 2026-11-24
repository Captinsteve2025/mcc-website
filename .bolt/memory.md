# Project memory

## Product intent & audience

- "Aquanimity" project: yacht charter/listing site with individual vessel pages.
- Site has a live yacht catalogue; navigation distinguishes charter yachts from managed yachts.
- Catalogue reachable from every page via main navigation (desktop + mobile).
- Public availability calendar on vessel pages shows booking status from CYA (Central Yacht Agent) API.
- Vessel pages include a "Dining & Cuisine" / "The Culinary Experience" section showcasing chef, food photography, and sample menus from CYA data.

## Brand personality & voice

- Nautical / sailing context; project name "Aquanimity" suggests calm-water themes.

## Visual design & UX direction

- Vessel pages feature a hero section and a social share (Open Graph) image; hero and share images can point to the same asset.
- Hero section supports video backgrounds: muted, looping autoplay with the photo shown first while the video loads.
- A semi-transparent dark-blue tint overlays the hero video to keep white headline/buttons readable; removing it would require text changes.
- Desktop navigation: "All Charter Yachts" link to live catalogue (replaced old "Browse Yachts" which lacked live inventory).
- Mobile menu: "All Charter Yachts" appears above "Managed Yachts".
- Availability calendar: confirmed bookings → Booked, active holds → Hold (expired holds dropped), transit → Transit, other → Unavailable, no record → unmarked/unknown. Empty bookings array never displayed as "available".
- Dining section: ivory background, navy text, serif headings, 16px body text. Photography leads the section before sample menus. Lightbox for food photos. Menu accordions initially collapsed, one open at a time. ARIA attributes on accordion buttons.

## Decisions, constraints & rationale

- Framework: Next.js.
- Deployment: Vercel at `https://mcc-website-one.vercel.app/`; sync to `collaborate` branch and redeploy.
- CYA API base URL `https://api.centralyachtagent.com/public/api/v1` already includes `/api/v1`; centralized URL-builder strips accidental duplicate prefixes.
- Catalogue yacht IDs (e.g. ENDLESS HORIZON `69f33df0b5a1600bf785869e`) are valid for CYA bookings API; legacy-ID mapping is only a fallback on 404.
- API key lives only in Vercel environment; live API calls cannot be run from dev/build — must test via deployed diagnostic.
- ffmpeg not installed; video compression unavailable; original-size assets used as-is.
- Transient build errors (EAGAIN) on file-system ops recur; unrelated to code, resolve on retry.
- QA harness lessons: lightbox overlay can block accordion interaction; heading `id="dining"` means selectors must target the containing section, not the heading.
- Production build passes after retrying transient filesystem errors; only lint warnings (unused imports/variables) and one image optimization notice remain.

## Open questions & assumptions

- Hull type discrepancy: Dufour 48 listed as "catamaran" by source — needs user confirmation.
- Video reuse rights: asset copied from sailaquanimity.com — user must confirm licensing.
- Video hero behavior (especially mobile) not yet browser-verified; compressed version would improve load.
- Live CYA bookings test for ENDLESS HORIZON not yet run; diagnostic should report HTTP status, booking count, categories, dates, calendar mapping.
- Dining section defects identified in production QA (not yet fixed — user reviewing findings before any code changes):
  - ENDLESS HORIZON: photo-only CYA records rendered as empty menu accordions (e.g. "Breads" opens to empty panel); section height ~10,086px desktop / 12,829px mobile.
  - MISCHIEVOUS: literal `Chef&rsquo;s` entity visible in introductory text; `cleanText` path doesn't decode named entities.
  - VIVA LA VIDA: hardcoded fallback intro "Every meal is prepared fresh on board by your charter chef" is invented content, not CYA-sourced.
  - Chef names present in CYA menu titles but not displayed as a dedicated hierarchy line.
  - Automated tests lack assertions for empty panels, visible entities, fabricated fallback copy, and genuine post-expansion screenshots.