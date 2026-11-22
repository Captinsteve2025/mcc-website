# Project memory

## Product intent & audience

- "Aquanimity" project: yacht charter/listing site with individual vessel pages.
- Site has a live yacht catalogue; navigation distinguishes charter yachts from managed yachts.
- Catalogue reachable from every page via main navigation (desktop + mobile).

## Brand personality & voice

- Nautical / sailing context; project name "Aquanimity" suggests calm-water themes.

## Visual design & UX direction

- Vessel pages feature a hero section and a social share (Open Graph) image; hero and share images can point to the same asset.
- Hero section supports video backgrounds: muted, looping autoplay with the photo shown first while the video loads.
- A semi-transparent dark-blue tint overlays the hero video to keep white headline/buttons readable; removing it would require text changes.
- Desktop navigation: "All Charter Yachts" link to live catalogue (replaced old "Browse Yachts" which lacked live inventory).
- Mobile menu: "All Charter Yachts" appears above "Managed Yachts".

## Decisions, constraints & rationale

- Framework: Next.js.
- Menu link changed from "Browse Yachts" (dead/static page) to "All Charter Yachts" (live catalogue) in both desktop and mobile menus per user request.
- ffmpeg not installed; video compression unavailable; original-size assets used as-is.
- Reused Aquanimity site's existing hero video as page background per user request; rights to reuse not yet confirmed.
- Transient build errors (EAGAIN) on file-system ops recur; unrelated to code, resolve on retry.
- Deployment workflow: sync to `collaborate` branch and redeploy.

## Open questions & assumptions

- Hull type discrepancy: Dufour 48 is generally a monohull, but source page says "catamaran" and provided photo shows a sailing catamaran. Needs user confirmation before publishing.
- Video reuse rights: asset copied from sailaquanimity.com — user must confirm licensing.
- Video hero behavior (especially on mobile) not yet verified in a browser; a compressed version would improve load performance.
- Updated pages have not yet been verified in a browser.