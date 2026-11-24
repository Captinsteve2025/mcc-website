import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "https://mcc-website-one.vercel.app";
const YACHTS = [
  { name: "ENDLESS HORIZON", id: "69f33df0b5a1600bf785869e" },
  { name: "MISCHIEVOUS", id: "69f33df2b5a1600bf78586a2" },
  { name: "OHANA", id: "6a023755ce6b8709506dfee5" },
  { name: "VIVA LA VIDA", id: "69f83a8e8ae166becdd09df5" },
];
const VIEWPORTS = [
  { label: "desktop", width: 1280, height: 720 },
  { label: "mobile", width: 412, height: 915 },
];
const SHOT_DIR = "test-results/dining-verification";
fs.mkdirSync(SHOT_DIR, { recursive: true });

const results = [];

const browser = await chromium.launch();
for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const yacht of YACHTS) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on("console", (msg) => { if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 300)); });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${String(err).slice(0, 300)}`));

    const result = { yacht: yacht.name, viewport: vp.label, consoleErrors, failures: [] };
    const fail = (msg) => result.failures.push(msg);

    try {
      await page.goto(`${BASE}/charter-yachts/${yacht.id}`, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForTimeout(2500);
      // Scroll to the dining anchor first (avoids re-render detaching the locator)
      await page.evaluate(() => {
        document.getElementById("dining")?.scrollIntoView({ block: "start" });
      });
      await page.waitForTimeout(1000);
      const section = page.locator("section", { has: page.locator("#dining") }).first();
      await section.scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(1000);

      const collapsedHeight = await section.evaluate((el) => el.scrollHeight);
      result.collapsedHeight = collapsedHeight;

      // full collapsed section screenshot: resize viewport trick — capture element screenshot instead
      await section.screenshot({ path: `${SHOT_DIR}/${yacht.name}-${vp.label}-collapsed.png` });

      // no dish text visible on load: check section's visible text before expansion
      const visibleText = await section.innerText();
      if (/Freshly Baked Pastries|Warm butter croissants/.test(visibleText) && yacht.name === "ENDLESS HORIZON") {
        fail("Dish text visible on initial load");
      }
      // no empty accordion panels: expand each and check body content
      const buttons = section.locator("h3 button[aria-expanded]");
      const count = await buttons.count();
      result.accordionCount = count;
      let emptyPanels = 0;
      for (let i = 0; i < count; i++) {
        const btn = buttons.nth(i);
        await btn.click();
        await page.waitForTimeout(250);
        const expanded = await btn.getAttribute("aria-expanded");
        if (expanded !== "true") fail(`Accordion ${i} did not expand`);
        // one open at a time
        const anyOtherOpen = await section.locator('h3 button[aria-expanded="true"]').count();
        if (anyOtherOpen > 1) fail("More than one accordion open simultaneously");
        const panel = page.locator(`[id="menu-panel-${i}"]`);
        const panelText = (await panel.innerText()).trim();
        if (panelText.length === 0) emptyPanels++;
        if (i === 0 || /BREAKFAST|Main|MAIN|DESSERTS/.test(await btn.innerText())) {
          // key screenshots for EH below
        }
        await btn.click(); // collapse again
        await page.waitForTimeout(150);
      }
      result.emptyPanels = emptyPanels;
      if (emptyPanels > 0) fail(`${emptyPanels} empty accordion panel(s)`);

      // entity / raw tag check on full page text
      const bodyText = await page.locator("body").innerText();
      const entityMatch = bodyText.match(/&[a-zA-Z]{2,8};|&#[0-9]+;/);
      if (entityMatch) fail(`Visible HTML entity: ${entityMatch[0]}`);
      result.fabricatedFallback = /Every meal is prepared fresh on board/.test(bodyText);
      if (result.fabricatedFallback) fail("Fabricated fallback intro rendered");

      // horizontal overflow
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      result.horizontalOverflowPx = overflow;
      if (overflow > 0) fail(`Horizontal overflow: ${overflow}px`);

      // photography immediately after intro: gallery images present and loaded
      const imgs = section.locator("figure img");
      result.galleryImages = await imgs.count();

      // EH-specific: expand BREAKFAST, MAIN COURSES, DESSERTS with screenshots + expanded height
      if (yacht.name === "ENDLESS HORIZON") {
        let expandedHeight = collapsedHeight;
        for (const title of ["BREAKFAST", "MAIN COURSES", "DESSERTS"]) {
          const btn = section.locator("h3 button", { hasText: title }).first();
          if ((await btn.count()) === 0) { fail(`${title} accordion not found`); continue; }
          await btn.click();
          await page.waitForTimeout(400);
          if (title === "BREAKFAST") {
            expandedHeight = await section.evaluate((el) => el.scrollHeight);
            const txt = await section.innerText();
            if (!/Eggs Benedict/.test(txt)) fail("Breakfast content missing after expansion");
          }
          await section.screenshot({ path: `${SHOT_DIR}/${yacht.name}-${vp.label}-expanded-${title.toLowerCase().replace(/\s+/g, "-")}.png` });
          await btn.click();
          await page.waitForTimeout(200);
        }
        result.expandedHeight = expandedHeight;
        // transition to next section
        const nextSection = page.locator("section").filter({ hasText: /Overview|Specifications/ }).first();
        await nextSection.scrollIntoViewIfNeeded().catch(() => {});
        await page.screenshot({ path: `${SHOT_DIR}/${yacht.name}-${vp.label}-transition.png` });
      }

      // mobile collapsed screenshot already covered by generic collapsed shot
      if (result.failures.length === 0 && collapsedHeight > 0) result.status = "PASS";
      else result.status = "FAIL";
    } catch (err) {
      result.status = "ERROR";
      result.failures.push(String(err).slice(0, 400));
    }
    results.push(result);
    await page.close();
  }
  await context.close();
}
await browser.close();

for (const r of results) {
  console.log(`\n=== ${r.yacht} [${r.viewport}] — ${r.status}`);
  console.log(`collapsed: ${r.collapsedHeight ?? "?"}px  expanded: ${r.expandedHeight ?? "-"}px  accordions: ${r.accordionCount ?? "?"}  empty: ${r.emptyPanels ?? "-"}  galleryImgs: ${r.galleryImages ?? "?"}  overflow: ${r.horizontalOverflowPx ?? "?"}px`);
  if (r.failures.length) r.failures.forEach((f) => console.log(`  FAIL: ${f}`));
  if (r.consoleErrors.length) console.log(`  console errors: ${r.consoleErrors.length}`);
}
fs.writeFileSync(`${SHOT_DIR}/results.json`, JSON.stringify(results, null, 2));
console.log(`\nScreenshots: ${SHOT_DIR}/`);
