# MCC website styling packet

Apply this guide to every My Caribbean Charters page migration. Before starting a page, read this guide and inspect the deployed homepage, relevant existing pages, and the shared components they use. The live MCC website is the visual reference for layout and component usage. [Deployed MCC website](https://mcc-website-one.vercel.app/)

## Palette

| Colour | Value | Use |
| --- | --- | --- |
| Deep navy | `#061625` | Body text on light surfaces, dark sections, image overlays, and outline buttons |
| Golden orange | `#EE9739` | Primary fills, focus rings, and accents such as hero labels and icons |
| Burnt orange | `#EA6F33` | Primary button hover |
| Dark orange | `#D85F2D` | Primary button pressed state |
| Warm ivory | `#F8F7F4` | Alternating content sections and light panels |
| White | `#FFFFFF` | Light surfaces and high-contrast copy on dark sections |

Use this palette for migrated page styling. Use opacity variants of these colours where established components do so. The approved orange replaces the obsolete peach palette. Request Steve’s approval before introducing new palettes, fonts, design conventions, or changes to shared components and global styles. Flag conflicts in existing shared components for review.

## Typography and layout

- Use `font-display` for Playfair Display editorial headings and inherit `font-sans` for Inter body text, navigation, buttons, and supporting copy.
- Follow the existing hierarchy. Destination heroes use normal-weight italic headings at `text-4xl md:text-5xl lg:text-6xl`. Section headings commonly use `text-3xl md:text-4xl`. Where a section needs a label, use the existing small uppercase style with tracked letter spacing.
- Reuse the existing header, footer, buttons, and cards. Match nearby page containers, responsive spacing, image ratios, navy hero gradients, warm ivory and white sections, and established radii and shadows. Use the golden-orange primary action and the destination pages’ translucent white secondary action on photographic heroes.
- Keep keyboard focus visible and check text contrast against the actual surface. Preserve existing content, SEO metadata, and service integrations during visual changes.

## Review

Compare the page with the deployed homepage and at least two relevant destination pages. Check the desktop, tablet, and mobile layouts, including buttons, headings, backgrounds, and interaction states. Search migrated source for obsolete colours, run TypeScript, lint, and the production build, and provide desktop and mobile screenshots for review.
