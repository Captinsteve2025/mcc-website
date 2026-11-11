# Project memory

## Product intent & audience

- "Aquanimity" project: boat/yacht listing or charter site with individual vessel pages.
- Vessel pages include descriptive content (e.g., Dufour 48 page sourced from an external page describing a "catamaran").

## Brand personality & voice

- Nautical / sailing context; project name "Aquanimity" suggests calm-water themes.

## Visual design & UX direction

- Vessel pages feature a hero section and a social share (Open Graph) image.
- Hero and share images can point to the same asset.
- Hero section supports video backgrounds: muted, looping autoplay with the photo shown first while the video loads.
- A semi-transparent dark-blue tint overlays the hero video to keep white headline/buttons readable; removing it would require text changes.
- Hero video asset: ~15 MB MP4 copied from sailaquanimity.com homepage.

## Decisions, constraints & rationale

- Framework: Next.js.
- ffmpeg is not installed in the environment, so video compression is currently unavailable; original-size assets must be used as-is.
- Reused the Aquanimity site's existing hero video as the page background per user request; rights to reuse not yet confirmed.
- Transient build errors (EAGAIN) on file-system ops recur; unrelated to code, resolve on retry.
- Removed an earlier duplicate downloaded image to avoid redundancy.

## Open questions & assumptions

- Hull type discrepancy: Dufour 48 is generally a monohull, but the source page says "catamaran" and the provided photo shows a sailing catamaran. Needs user confirmation before publishing.
- Video reuse rights: asset copied from sailaquanimity.com — user must confirm licensing.
- Video hero behavior (especially on mobile) not yet verified in a browser; a compressed version would improve load performance.
- Updated page has not yet been verified in a browser.