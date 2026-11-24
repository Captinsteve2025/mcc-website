// Standalone Chromium verification run for the live production site.
// Produces the same evidence as the Playwright suite but with fixed waits,
// which is what the constrained sandbox needs. Results print as JSON.
import { chromium } from "@playwright/test";

const BASE = "https://mcc-website-one.vercel.app";
const EH = "69f33df0b5a1600bf785869e";

async function checkYacht(browser, yachtId, viewport) {
  const page = browser.newPage ? null : null; // placeholder to satisfy lint
  return { page, viewport, yachtId };
}

const browser = await chromium.launch();

async function run(viewportName, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on("console", (m) => { if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`); });
  const results = {};
  await page.goto(`${BASE}/charter-yachts/${EH}`, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(2000);
  results.pageTitle = await page.title();

  await page.locator("#dining").scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);
  // Lazy images load only as they enter the viewport: scroll the whole section
  // past the screen, then settle.
  await page.evaluate(() => {
    const sec = document.getElementById("dining")?.closest("section");
    sec?.scrollIntoView({ block: "end" });
  });
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(2000);

  results.dining = await page.evaluate(() => {
    const el = document.getElementById("dining");
    const section = el?.closest("section");
    if (!el || !section) return { present: false };
    const imgs = Array.from(section.querySelectorAll("img")).map((i) => {
      const im = i;
      return { src: im.currentSrc || im.src, ok: im.complete && im.naturalWidth > 0 };
    });
    const captions = Array.from(section.querySelectorAll("figcaption")).map((f) => (f.textContent ?? "").trim());
    const text = section.innerText ?? "";
    return {
      present: true,
      heading: (el.textContent ?? "").trim(),
      imageCount: imgs.length,
      loadedImages: imgs.filter((i) => i.ok).length,
      distinctLoaded: [...new Set(imgs.filter((i) => i.ok).map((i) => i.src))].length,
      imageLoadStates: imgs.map((i) => ({ src: i.src.slice(-40), complete: i.complete, w: i.naturalWidth })),
      captions,
      chefIntro: /Heather Arndt/i.test(text),
      literalEntities: /&bull;|&amp;bull;|&lt;p&gt;|&lt;br/.test(text),
      emptyCards: Array.from(section.querySelectorAll("article")).filter((a) => !a.querySelector("img") && !(a.textContent ?? "").trim()).length,
    };
  });

  // Lightbox
  try {
    const trigger = page.locator("section:has(#dining) figure button").first();
    await trigger.click({ timeout: 5000 });
    const dialog = page.locator('[role="dialog"]');
    const opened = await dialog.isVisible();
    if (opened) await dialog.click({ position: { x: 10, y: 10 } });
    await page.waitForTimeout(400);
    results.lightbox = { opened, closed: !(await dialog.isVisible().catch(() => false)) };
  } catch {
    results.lightbox = { opened: false, closed: false };
  }

  results.browserErrors = errors;
  results.horizontalOverflowPx = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await context.close();
  return results;
}

const out = {
  desktop: await run("desktop", { width: 1280, height: 720 }),
  mobile: await run("mobile", { width: 412, height: 915 }),
};
await browser.close();
console.log(JSON.stringify(out, null, 2));
