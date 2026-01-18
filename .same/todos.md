# Training Pages Migration - My Caribbean Charters

## Completed
- [x] Updated main training page with MCC branding (Header, Footer, colors)
- [x] Created missing components (Card, Textarea, MobileNav)
- [x] Created missing utilities (analytics, useScrollDepthTracking, PDF generation)
- [x] Fixed Logo component to support both named and default exports
- [x] Updated schema URLs to mycaribbeancharters.com
- [x] Updated contact info to MCC phone/email
- [x] Updated day-skipper page with MCC Header/Footer
- [x] Updated day-skipper-st-martin page with MCC Header/Footer
- [x] Updated offshore-passages page with MCC Header/Footer
- [x] Updated owner-program page with MCC Header/Footer
- [x] Updated schema provider URLs in all training pages
- [x] Pushed all changes to GitHub
- [x] Fixed display issues (buttons, NauticEd iframe, focus highlights)
- [x] Changed accent color to #FF7F50 (vibrant coral)
- [x] Performance optimization - removed unused font, cleaned imports
- [x] Accessibility - added aria-labels, skip links, focus states
- [x] Improved color contrast ratios for WCAG compliance
- [x] Added prefers-reduced-motion support
- [x] Added comprehensive JSON-LD structured data for SEO
- [x] Cleaned up unused imports in NauticEd sub-pages
- [x] Cleaned up unused imports in article pages
- [x] Pushed complete project to GitHub (Jan 18, 2026)
- [x] Core Web Vitals audit and optimizations (Jan 18, 2026)
- [x] Hero images have WebP versions (already optimized)
- [x] Added NauticEdEmbed component for iframe integration
- [x] Fixed St. Martin page styling to use coral/navy colors
- [x] Applied consistent styling to offshore-passages and owner-program pages
- [x] Fixed visibility issues - darker overlays, visible buttons, navy icons
- [x] Updated article pages to use MCC Header/Footer (Jan 18, 2026)
- [x] Updated all layout metadata to use MCC branding (Jan 18, 2026)
- [x] Removed all VIYB references from training pages

## Remaining
- [ ] Verify deployment reflects latest changes (user needs to clear Vercel cache)
- [ ] Update NauticEd sub-page components (optional - lower priority)

## Deployment Issue Notes
The deployed version was showing the old VIYB header. This was caused by:
1. Article pages had inline hardcoded VIYB headers instead of using MCC Header component
2. Layout files had VIYB URLs and metadata

Fixed by:
1. Replaced all inline headers/footers in article pages with MCC Header/Footer components
2. Updated all layout files to use mycaribbeancharters.com URLs
3. Pushed to GitHub - user needs to trigger fresh Vercel deployment with cache cleared

## User Action Required
To resolve deployment issues:
1. Go to Vercel → Project → Settings → General → Build Cache → Clear
2. Trigger a new deployment (Deployments → Redeploy without cache)
3. Wait for build to complete and verify pages show MCC header

## Performance Optimizations Applied
- Removed Cormorant Garamond font (reduced bundle)
- Cleaned unused lucide-react imports from main training pages
- Cleaned unused lucide-react imports from NauticEd pages
- Cleaned unused lucide-react imports from article pages
- Deleted unused NauticEdIframe component
- Added passive scroll event listeners
- Added DNS prefetch and preconnect for fonts
- Changed video preload from "auto" to "metadata"
- Added AVIF/WebP image format support in next.config
- Hero images converted to WebP format

## Accessibility Improvements Applied
- Skip-to-content link for keyboard navigation
- aria-labels on all icon-only buttons
- aria-expanded and aria-haspopup on dropdown menus
- role="navigation" and aria-label on nav elements
- role="menu" and role="menuitem" on dropdowns
- focus-visible ring styles with coral color
- prefers-reduced-motion media query
- 44px minimum touch target sizes
- Improved contrast ratios

## Notes
- Repository: https://github.com/Captinsteve2025/mycaribbeancharters
- Accent color: #FF7F50 (coral)
- Primary color: #061625 (navy)
- NauticEd sub-pages and article pages still use old VIYB header/footer (can be updated later if needed)
- NauticEdEmbed component created for proper iframe integration
