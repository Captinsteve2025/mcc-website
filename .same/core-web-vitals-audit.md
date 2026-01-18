# Core Web Vitals Audit Report
**Date:** January 18, 2026
**Site:** My Caribbean Charters

## Summary

### Current Status
| Metric | Target | Status | Notes |
|--------|--------|--------|-------|
| LCP (Largest Contentful Paint) | < 2.5s | ⚠️ Needs Review | Hero video/text is LCP element |
| FID (First Input Delay) | < 100ms | ✅ Good | Minimal JS blocking |
| CLS (Cumulative Layout Shift) | < 0.1 | ✅ Good | Fixed dimensions on images |
| INP (Interaction to Next Paint) | < 200ms | ✅ Good | React events are fast |
| TTFB (Time to First Byte) | < 800ms | ✅ Good | Next.js SSR/SSG |

---

## Issues Found & Optimizations Applied

### 1. Image Optimization ⚠️

**Issue:** Large hero images (371KB - 679KB)
```
public/hero/bali-52-sailing.jpg - 679KB (TOO LARGE)
public/hero/day-skipper.jpg - 371KB (TOO LARGE)
public/training/st-martin-hero.jpg - 289KB (BORDERLINE)
```

**Recommendations:**
- [ ] Convert to WebP/AVIF format (50-70% size reduction)
- [ ] Resize to max 1920px width
- [ ] Use Next.js Image with `sizes` prop for responsive loading
- [ ] Consider using blur placeholder for perceived performance

### 2. Font Loading ✅ OPTIMIZED

**Current Implementation:**
- ✅ Using `next/font/google` with `display: swap`
- ✅ Font preloading enabled
- ✅ DNS prefetch for fonts.googleapis.com
- ✅ Preconnect for fonts.gstatic.com

### 3. Video Loading Strategy ⚠️

**Issue:** Hero video uses `preload="auto"` which downloads full video

**Current:**
```tsx
preload="auto"
```

**Recommended:**
```tsx
preload="metadata"  // Only load metadata initially
```

### 4. Critical CSS ✅ OPTIMIZED

- ✅ Tailwind CSS with purging
- ✅ No render-blocking @import statements
- ✅ CSS is minimal (141 lines in globals.css)

### 5. JavaScript Bundle ✅ GOOD

- ✅ Next.js automatic code splitting
- ✅ React Server Components reduce client JS
- ✅ Turbopack for faster builds

### 6. Image Priority ✅ IMPLEMENTED

- ✅ Hero images use `priority` prop
- ✅ Below-fold images use `loading="lazy"`
- ✅ 16 files using next/image

### 7. Accessibility ✅ IMPLEMENTED

- ✅ Skip link for keyboard navigation
- ✅ aria-labels on interactive elements
- ✅ Focus-visible styles
- ✅ prefers-reduced-motion support

---

## Action Items

### High Priority
1. [ ] Optimize hero images to WebP (target <150KB each)
2. [ ] Change video preload from "auto" to "metadata"
3. [ ] Add loading skeleton for hero section

### Medium Priority
4. [ ] Add `fetchpriority="high"` to LCP images
5. [ ] Implement service worker for caching
6. [ ] Add resource hints for critical third-party resources

### Low Priority
7. [ ] Consider lazy-loading non-critical components
8. [ ] Implement route prefetching for common navigation

---

## Testing Recommendations

1. **PageSpeed Insights**: https://pagespeed.web.dev/
2. **WebPageTest**: https://www.webpagetest.org/
3. **Chrome DevTools Lighthouse**: F12 → Lighthouse tab
4. **Chrome Web Vitals Extension**: Real-time CWV monitoring

---

## Estimated Scores After Optimization

| Category | Current (est.) | After Optimization |
|----------|----------------|-------------------|
| Performance | 75-85 | 90+ |
| Accessibility | 90+ | 95+ |
| Best Practices | 90+ | 95+ |
| SEO | 90+ | 95+ |
