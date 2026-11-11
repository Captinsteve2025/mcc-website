# Project memory

## Product intent & audience

- "Aquanimity" project: boat/yacht listing or charter site with individual vessel pages.
- Vessel pages include descriptive content (e.g., Dufour 48 page sourced from an external page describing a "catamaran").

## Brand personality & voice

- Nautical / sailing context; project name "Aquanimity" suggests calm-water themes.

## Visual design & UX direction

- Vessel pages feature a hero image and a social share (Open Graph) image.
- Hero and share images can point to the same asset.

## Decisions, constraints & rationale

- Framework: Next.js.
- New user-provided photo set as hero + social share image for the Aquanimity/Dufour 48 page.
- Removed an earlier duplicate downloaded image to avoid redundancy.
- Transient build errors (EAGAIN) observed on file-system ops; unrelated to code changes, resolved on retry.

## Open questions & assumptions

- Hull type discrepancy: Dufour 48 is generally a monohull, but the source page says "catamaran" and the provided photo shows a sailing catamaran. Needs user confirmation before publishing.
- Updated page has not yet been verified in a browser.