# MCC Product Standards

These standards define the commercial quality bar for the My Caribbean Charters (MCC) website. They apply to every component of this website and all future development sessions. Companion document: `MCC_PRODUCT_IMPROVEMENT_REGISTER.md` (status of every item against these standards).

## Commercial objective

This is not a replacement for an old website or an interface onto a data API. We are building an industry-leading luxury yacht charter website that:

- Inspires prospective charter guests.
- Encourages visitors to explore yachts and destinations.
- Builds confidence in MCC as a professional charter brokerage.
- Generates qualified direct charter enquiries.
- Increases confirmed charter bookings and company revenue.

The competitive benchmark is leading luxury yacht charter and luxury travel websites — not the previous MCC website. Technical functionality is the minimum requirement, not the measure of success.

## The ten assessment criteria

Every major component is assessed against all ten criteria. A component is not "done" because it compiles, renders, or passes automated assertions.

1. **Functional correctness** — the feature works with real production data, including empty, malformed and edge-case data.
2. **Premium visual presentation** — typography, spacing, colour and imagery meet luxury-travel expectations. Do not downgrade an agreed premium design because a basic implementation is easier to build.
3. **Customer experience** — the flow feels effortless and encourages exploration; information design serves the guest, not the data source.
4. **Visitor engagement** — the component invites interaction (galleries, menus, calendars) rather than passive scrolling.
5. **Conversion potential** — the component moves visitors toward an enquiry; relevant CTAs are visible without dominating content.
6. **Mobile usability** — the experience is first-class on small viewports, not a shrunken desktop.
7. **Performance** — images are optimised and lazy-loaded; the page remains fast on mobile networks; layout does not shift.
8. **Accessibility** — keyboard operability, ARIA correctness, sufficient contrast, visible focus states.
9. **SEO compatibility** — server-rendered content, semantic markup, descriptive metadata.
10. **Production browser verification** — real Chromium testing against the deployed site, on desktop and mobile, with screenshots; a passing build alone never marks a component complete.

## Working rules

- Apply the mandatory [MCC website styling packet](BRAND_GUIDE.md) to every page migration. Read it and inspect the existing site components before beginning the work.
- Every change is verified in production after deployment before it is reported as working.
- CYA (Central Yacht Agent) content is displayed exactly as supplied: nothing is invented, no stock photography, no fabricated fallback copy. When reliable extraction is impossible, complete original content is preserved inside a collapsed panel rather than forcing unreliable parsing.
- When an interim solution is accepted, the intended premium solution is retained as an outstanding improvement in the register.
- A component's status progression is: Identified → Planned → In development → Implemented → Deployed → Production verified → Visually approved → Approved for launch. An implemented component is not automatically complete.
- Do not modify the enquiry system, database configuration, email notifications, CYA booking integration or SEO migration configuration without explicit instruction.
