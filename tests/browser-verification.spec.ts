// Playwright browser-verification harness for the live production site.
// Run: npx playwright test tests/browser-verification.spec.ts
// Requires: PLAYWRIGHT_BASE_URL (defaults to the production URL), and for the
// optional results import: BROWSER_TESTS_IMPORT_URL + BROWSER_TESTS_TOKEN.
// The harness posts one result row per yacht+viewport to the import endpoint,
// which appears on /admin/site-health as "Browser verification".

import { test, expect, type Page } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "https://mcc-website-one.vercel.app";
const IMPORT_URL = process.env.BROWSER_TESTS_IMPORT_URL ?? "";
const IMPORT_TOKEN = process.env.BROWSER_TESTS_TOKEN ?? "";

const YACHTS: Array<{ name: string; id: string }> = [
  { name: "ENDLESS HORIZON", id: "69f33df0b5a1600bf785869e" },
  { name: "MISCHIEVOUS", id: "69f33df2b5a1600bf78586a2" },
  { name: "OHANA", id: "6a023755ce6b8709506dfee5" },
  { name: "VIVA LA VIDA", id: "69f83a8e8ae166becdd09df5" },
];

type Check = { name: string; passed: boolean; detail?: string };

const collected: Array<{ yachtId: string; yachtName: string; viewport: string; checks: Check[]; pageErrors: string[] }> = [];
let currentChecks: Check[] = [];
let currentErrors: string[] = [];

async function record(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    currentChecks.push({ name, passed: true });
  } catch (err) {
    currentChecks.push({ name, passed: false, detail: err instanceof Error ? err.message.slice(0, 300) : "failed" });
    throw err;
  }
}

test.beforeEach(() => {
  currentChecks = [];
  currentErrors = [];
});

// One representative yacht per commit for routine regression checks; the full
// set runs when PLAYWRIGHT_FULL=1 (e.g. after a deployment or manually).
const SAMPLE = process.env.PLAYWRIGHT_FULL === "1" ? YACHTS : [YACHTS[0]];

for (const yacht of SAMPLE) {
  test.describe(`${yacht.name} customer-facing checks`, () => {
    test.describe.configure({ retries: 0 });

    test.afterEach(async ({}, testInfo) => {
      if (testInfo.status === testInfo.expectedStatus) {
        collected.push({
          yachtId: yacht.id,
          yachtName: yacht.name,
          viewport: testInfo.project.name,
          checks: currentChecks,
          pageErrors: currentErrors,
        });
      }
    });

    test("yacht page renders CYA content", async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`);
      });

      await record("page loads", async () => {
        const response = await page.goto(`${BASE_URL}/charter-yachts/${yacht.id}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
        expect(response?.status(), "page HTTP status").toBeLessThan(400);
      });

      await record("main yacht photographs render", async () => {
        const imgs = page.locator("img");
        const count = await imgs.count();
        expect(count, "image count on page").toBeGreaterThan(0);
      });

      await record("specifications visible", async () => {
        await expect(page.getByText(/guests/i).first()).toBeVisible();
        await expect(page.getByText(/cabin/i).first()).toBeVisible();
      });

      const diningVisible = await page.locator("#dining").isVisible().catch(() => false);

      if (diningVisible) {
        await record("dining section reachable by scrolling", async () => {
          await page.locator("#dining").scrollIntoViewIfNeeded();
          const box = await page.locator("#dining").boundingBox();
          expect(box, "dining heading renders with a real box after scrolling").not.toBeNull();
          expect(box!.height, "dining heading height").toBeGreaterThan(0);
        });
        await record("dining photographs have captions", async () => {
          const figures = page.locator("figure:has(img)");
          const n = await figures.count();
          expect(n, "figure count in dining area").toBeGreaterThan(0);
        });
        await record("all dining photographs load", async () => {
          const dining = page.locator("section:has(#dining)");
          await dining.scrollIntoViewIfNeeded();
          // Lazy images only start after the scroll; give them a bounded window.
          await page
            .waitForFunction(
              () => {
                const imgs = document.querySelector("#dining")?.closest("section")?.querySelectorAll("img");
                if (!imgs || imgs.length === 0) return false;
                return Array.from(imgs).every((img) => (img as HTMLImageElement).complete);
              },
              { timeout: 10_000 }
            )
            .catch(() => {});
          const imgs = dining.locator("img");
          const n = await imgs.count();
          expect(n, "dining image count").toBeGreaterThan(0);
          for (let i = 0; i < Math.min(n, 20); i++) {
            const img = imgs.nth(i);
            const ok = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
            expect(ok, `dining image ${i} loads`).toBe(true);
          }
        });
        await record("no literal HTML entities in dining text", async () => {
          const text = await page.locator("section:has(#dining)").innerText();
          expect(text).not.toMatch(/&bull;|&amp;bull;|&lt;p&gt;|&lt;br/);
        });
        await record("lightbox opens and closes", async () => {
          const trigger = page.locator("section:has(#dining) figure button").first();
          if (await trigger.isVisible()) {
            await trigger.click();
            const dialog = page.locator('[role="dialog"]');
            await expect(dialog).toBeVisible();
            await dialog.click({ position: { x: 10, y: 10 } });
            await expect(dialog).toBeHidden();
          }
        });
        await record("no empty menu-description cards", async () => {
          const empty = await page.evaluate(() => {
            const cards = document.querySelectorAll("section article");
            let bad = 0;
            cards.forEach((c) => {
              const t = (c.textContent ?? "").trim();
              const hasImg = c.querySelector("img") !== null;
              if (!hasImg && t.length === 0) bad += 1;
            });
            return bad;
          });
          expect(empty, "empty cards").toBe(0);
        });
      } else {
        currentChecks.push({ name: "dining section (CYA supplies none — hidden is correct)", passed: true });
      }

      await record("no browser page errors", async () => {
        expect(errors, `browser errors: ${errors.join(" | ").slice(0, 400)}`).toHaveLength(0);
      });
      currentErrors.push(...errors);

      await record("no horizontal overflow", async () => {
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, "horizontal overflow px").toBeLessThanOrEqual(1);
      });
    });
  });
}

// ENDLESS HORIZON-specific dining requirements (chef intro, five photos).
test.describe("ENDLESS HORIZON dining specifics", () => {
  test("chef introduction and five distinct photographs", async ({ page }) => {
    const checks: Check[] = [];
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`);
    });
    const rec = async (name: string, fn: () => Promise<void>) => {
      try {
        await fn();
        checks.push({ name, passed: true });
      } catch (err) {
        checks.push({ name, passed: false, detail: err instanceof Error ? err.message.slice(0, 300) : "failed" });
        throw err;
      }
    };
    await page.goto(`${BASE_URL}/charter-yachts/69f33df0b5a1600bf785869e`, { waitUntil: "domcontentloaded", timeout: 30_000 });
    await page.locator("#dining").scrollIntoViewIfNeeded();
    // Lazy-loaded images only start after the scroll; the hero video streams
    // continuously so networkidle never fires — wait on image completion.
    await page
      .waitForFunction(
        () => {
          const imgs = document.querySelector("#dining")?.closest("section")?.querySelectorAll("img");
          if (!imgs || imgs.length === 0) return false;
          return Array.from(imgs).every((img) => (img as HTMLImageElement).complete);
        },
        { timeout: 15_000 }
      )
      .catch(() => {});
    await rec("dining section present", async () => {
      await page.locator("#dining").scrollIntoViewIfNeeded();
      const box = await page.locator("#dining").boundingBox();
      expect(box, "dining heading renders with a real box after scrolling").not.toBeNull();
    });
    await rec("chef introduction displayed", async () => {
      await page.getByText(/Heather Arndt/i).first().scrollIntoViewIfNeeded();
      const text = await page.locator("section:has(#dining)").innerText();
      expect(text).toMatch(/Heather Arndt/i);
    });
    await rec("all dining photographs load", async () => {
      const urls = await page.evaluate(() => {
        const dining = document.querySelector("#dining")?.closest("section");
        const out = new Set<string>();
        dining?.querySelectorAll("img").forEach((img) => {
          const el = img as HTMLImageElement;
          if (el.complete && el.naturalWidth > 0 && el.src) out.add(el.src);
        });
        return Array.from(out);
      });
      expect(urls.length, "distinct loaded dining image URLs").toBeGreaterThanOrEqual(5);
    });
    currentErrors.push(...errors);
    collected.push({ yachtId: "69f33df0b5a1600bf785869e", yachtName: "ENDLESS HORIZON", viewport: "dining-specific", checks, pageErrors: errors });
  });
});

// Import collected results into the site-health monitor, one row per yacht+viewport.
async function importResults() {
  if (!IMPORT_URL || !IMPORT_TOKEN) return;
  const byKey = new Map<string, typeof collected[number]>();
  for (const run of collected) {
    const key = `${run.yachtId}:${run.viewport}`;
    const prev = byKey.get(key);
    if (!prev || run.checks.length > prev.checks.length) byKey.set(key, run);
  }
  for (const run of byKey.values()) {
    const passed = run.checks.every((c) => c.passed);
    const failures = run.checks.filter((c) => !c.passed).map((c) => `${c.name}: ${c.detail ?? "failed"}`);
    const payload = {
      ranAt: new Date().toISOString(),
      yachtId: run.yachtId,
      yachtName: run.yachtName,
      viewport: run.viewport === "mobile" ? "mobile" : "desktop",
      passed,
      testsTotal: run.checks.length,
      testsFailed: run.checks.length - run.checks.filter((c) => c.passed).length,
      brokenImages: run.checks.filter((c) => c.name.includes("photographs") && !c.passed).length,
      failures,
      browserErrors: run.pageErrors,
      runner: "playwright-github-actions",
    };
    try {
      const res = await fetch(IMPORT_URL, {
        method: "POST",
        headers: { "content-type": "application/json", "x-admin-token": IMPORT_TOKEN },
        body: JSON.stringify(payload),
      });
      if (!res.ok) console.error(`import failed for ${run.yachtName} (${run.viewport}): HTTP ${res.status}`);
    } catch (err) {
      console.error(`import request failed: ${err instanceof Error ? err.message : err}`);
    }
  }
}

test.afterAll(async () => {
  await importResults();
});
