// Independent production QA audit of the Dining & Cuisine redesign.
// Read-only: loads each live yacht page in Chromium (desktop + mobile),
// captures screenshots before/after expanding menus, and records evidence.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "https://mcc-website-one.vercel.app";
const OUT = "qa-evidence";
mkdirSync(`${OUT}/screens`, { recursive: true });

const YACHTS = [
  { id: "69f33df0b5a1600bf785869e", name: "endless-horizon" },
  { id: "69f33df2b5a1600bf78586a2", name: "mischievous" },
  { id: "6a023755ce6b8709506dfee5", name: "ohana" },
  { id: "69f83a8e8ae166becdd09df5", name: "viva-la-vida" },
];

const VIEWPORTS = [
  { tag: "desktop", width: 1280, height: 720, ua: undefined },
  {
    tag: "mobile",
    width: 412,
    height: 915,
    ua: "Mozilla/5.0 (Linux; Android 10; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36",
  },
];

const results = [];

for (const yacht of YACHTS) {
  for (const vp of VIEWPORTS) {
    const rec = { yacht: yacht.name, viewport: vp.tag, url: `${BASE}/charter-yachts/${yacht.id}` };
    const browser = await chromium.launch();
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.ua,
      deviceScaleFactor: vp.tag === "mobile" ? 2 : 1,
      isMobile: vp.tag === "mobile",
    });
    const page = await ctx.newPage();
    const consoleErrors = [];
    const failedRequests = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(m.text().slice(0, 300));
    });
    page.on("requestfailed", (r) => failedRequests.push(`${r.url().slice(0, 160)} :: ${r.failure()?.errorText}`));
    page.on("response", (r) => {
      if (r.status() >= 400) failedRequests.push(`${r.url().slice(0, 160)} :: HTTP ${r.status()}`);
    });

    try {
      await page.goto(rec.url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(2500);

      const dining = page.locator("#dining");
      rec.diningPresent = (await dining.count()) > 0;
      if (!rec.diningPresent) {
        rec.consoleErrors = consoleErrors;
        rec.failedRequests = failedRequests;
        results.push(rec);
        await browser.close();
        continue;
      }

      await dining.scrollIntoViewIfNeeded();
      await page.evaluate(() => {
        const el = document.getElementById("dining");
        const end = el.getBoundingClientRect().bottom + window.scrollY;
        window.scrollTo({ top: end - window.innerHeight });
      });
      await page.waitForTimeout(1200);

      // --- Section content probes (before any interaction) ---
      rec.measurements = await page.evaluate(() => {
        const dining = document.getElementById("dining");
        const scope = dining.closest("section") ?? dining;
        const textOf = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();

        const headings = [...scope.querySelectorAll("h1,h2,h3,h4")].slice(0, 12).map((h) => ({
          tag: h.tagName.toLowerCase(),
          text: textOf(h).slice(0, 90),
        }));

        const label = [...scope.querySelectorAll("p")].find((p) =>
          /culinary experience/i.test(p.textContent ?? ""),
        );
        const labelStyle = label ? getComputedStyle(label) : null;

        const chefLine = [...scope.querySelectorAll("p,h3,h4,div")].find((el) =>
          el.children.length === 0 && /chef\s+[a-z]/i.test(textOf(el)) && textOf(el).length < 80,
        );
        const chefLineText = chefLine ? textOf(chefLine) : null;

        const introCandidates = [...scope.querySelectorAll("p")].filter(
          (p) => (p.textContent ?? "").trim().length > 120 && !/culinary experience/i.test(p.textContent ?? ""),
        );
        const introSample = textOf(introCandidates[0]).slice(0, 160) || null;

        const galleryImgs = [...scope.querySelectorAll("img")].filter((img) => {
          const r = img.getBoundingClientRect();
          return img.width > 80 && img.height > 60;
        });
        const urls = galleryImgs.map((i) => i.currentSrc || i.src);
        const distinct = new Set(urls);

        const captions = galleryImgs
          .map((i) => {
            const fig = i.closest("figure");
            const cap = fig?.querySelector("figcaption");
            return cap ? cap.textContent.replace(/\s+/g, " ").trim().slice(0, 70) : null;
          })
          .filter(Boolean);

        const literalTagEls = [...scope.querySelectorAll("*")].filter((el) =>
          el.children.length === 0 &&
          /&lt;|&gt;|&amp;lt|&rsquo;|&quot;|&bull;|<pre|<br\s*\/?>|<span/i.test(el.textContent ?? "") &&
          (el.textContent ?? "").length < 400,
        );
        const literalTags = [...new Set(literalTagEls.map((e) => textOf(e).slice(0, 120)))].slice(0, 5);

        const emptyCards = [...scope.querySelectorAll("figure,li,article,div")]
          .filter((el) => el.children.length === 0 && (el.textContent ?? "").trim() === "" && el.offsetWidth > 40 && el.offsetHeight > 40)
          .length;

        const accordions = [...scope.querySelectorAll("button[aria-expanded]")].map((b) => ({
          label: textOf(b).slice(0, 60),
          expanded: b.getAttribute("aria-expanded") === "true",
          controls: b.getAttribute("aria-controls"),
        }));

        const viewAllBtn = [...scope.querySelectorAll("button")].find((b) => /view all/i.test(b.textContent ?? ""));
        const darkPanel = [...scope.querySelectorAll("div")].find((d) => {
          const bg = getComputedStyle(d).backgroundColor;
          const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          return m && Number(m[1]) < 30 && Number(m[2]) < 40 && Number(m[3]) < 60 && d.offsetHeight > 200 && /menu/i.test(d.textContent ?? "");
        });
        const bodyFontProbe = [...scope.querySelectorAll("p,li")].filter((p) => (p.textContent ?? "").trim().length > 40)
          .map((p) => ({ size: getComputedStyle(p).fontSize, lh: getComputedStyle(p).lineHeight }))[0] ?? null;

        return {
          headings,
          labelFound: Boolean(label),
          labelText: label ? textOf(label) : null,
          labelColor: labelStyle ? labelStyle.color : null,
          labelUppercase: labelStyle ? labelStyle.textTransform : null,
          chefLineText,
          introSample,
          imgCount: galleryImgs.length,
          distinctImgCount: distinct.size,
          captionsSample: captions.slice(0, 4),
          literalTags,
          emptyCards,
          accordions,
          viewAllText: viewAllBtn ? textOf(viewAllBtn).slice(0, 60) : null,
          darkPanelFound: Boolean(darkPanel),
          bodyFontProbe,
          sectionHeightPx: scope.getBoundingClientRect().height,
          pageOverflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });

      await page.screenshot({ path: `${OUT}/screens/${yacht.name}-${vp.tag}-before.png` });

      // Lightbox check
      const firstImg = page.locator('[id="dining"] img, section:has([id="dining"]) img').first();
      try {
        await firstImg.click({ timeout: 5000 });
        await page.waitForTimeout(600);
        rec.lightbox = {
          opened: (await page.locator("dialog[open], [role='dialog']:visible").count()) > 0,
          screenshot: `${yacht.name}-${vp.tag}-lightbox.png`,
        };
        if (rec.lightbox.opened) await page.screenshot({ path: `${OUT}/screens/${rec.lightbox.screenshot}` });
        await page.locator('[role="dialog"]:visible').click({ position: { x: 8, y: 8 } });
        await page.waitForTimeout(400);
      } catch {
        rec.lightbox = { opened: false, note: "image click did not open a dialog" };
      }

      // Verify one-at-a-time accordion behavior, then capture the open state.
      const accordButtons = page.locator('section:has(#dining) button[aria-expanded="false"]');
      const n = await accordButtons.count();
      if (n > 0) {
        await accordButtons.first().click();
        await page.waitForTimeout(500);
      }
      rec.accordionInteraction = await page.evaluate(() => {
        const dining = document.getElementById("dining");
        const scope = dining.closest("section") ?? dining;
        const buttons = [...scope.querySelectorAll("button[aria-expanded]")];
        return {
          buttonsTotal: buttons.length,
          openLabels: buttons.filter((b) => b.getAttribute("aria-expanded") === "true").map((b) => b.textContent.replace(/\s+/g, " ").trim()),
        };
      });
      await page.waitForTimeout(800);

      rec.afterExpand = await page.evaluate(() => {
        const dining = document.getElementById("dining");
        const scope = dining.closest("section") ?? dining;
        const buttons = [...scope.querySelectorAll("button[aria-expanded]")];
        const openPanels = buttons.filter((b) => b.getAttribute("aria-expanded") === "true");
        const panelTexts = openPanels.map((b) => {
          const panel = b.closest("div")?.parentElement?.querySelector(`#${CSS.escape(b.getAttribute("aria-controls") ?? "x")}`)
            ?? document.getElementById(b.getAttribute("aria-controls") ?? "x");
          const t = (panel?.textContent ?? "").replace(/\s+/g, " ").trim();
          return { label: b.textContent.replace(/\s+/g, " ").trim().slice(0, 50), panelChars: t.length, sample: t.slice(0, 110) };
        });
        const hOverflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const firstOpenPanel = openPanels[0]
          ? document.getElementById(openPanels[0].getAttribute("aria-controls") ?? "x")
          : null;
        let hShift = null;
        if (firstOpenPanel) {
          const before = firstOpenPanel.getBoundingClientRect();
          hShift = { left: Math.round(before.left), right: Math.round(window.innerWidth - before.right) };
        }
        return {
          buttonsTotal: buttons.length,
          openAfterClicks: openPanels.length,
          panelTexts,
          hOverflow,
          hShift,
        };
      });

      await page.screenshot({ path: `${OUT}/screens/${yacht.name}-${vp.tag}-after-expand.png` });

      rec.consoleErrors = consoleErrors.slice(0, 6);
      rec.failedRequests = failedRequests.slice(0, 6);
    } catch (err) {
      rec.error = String(err).slice(0, 300);
      rec.consoleErrors = consoleErrors.slice(0, 4);
      rec.failedRequests = failedRequests.slice(0, 4);
    }
    await browser.close();
    results.push(rec);
    console.log(`done: ${yacht.name} ${vp.tag}`);
  }
}

console.log("\n===AUDIT_JSON===");
console.log(JSON.stringify(results, null, 1));
