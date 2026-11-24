# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-verification.spec.ts >> ENDLESS HORIZON customer-facing checks >> yacht page renders CYA content
- Location: tests/browser-verification.spec.ts:62:5

# Error details

```
Error: dining image 0 loads

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Test source

```ts
  7   | 
  8   | import { test, expect, type Page } from "@playwright/test";
  9   | 
  10  | const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "https://mcc-website-one.vercel.app";
  11  | const IMPORT_URL = process.env.BROWSER_TESTS_IMPORT_URL ?? "";
  12  | const IMPORT_TOKEN = process.env.BROWSER_TESTS_TOKEN ?? "";
  13  | 
  14  | const YACHTS: Array<{ name: string; id: string }> = [
  15  |   { name: "ENDLESS HORIZON", id: "69f33df0b5a1600bf785869e" },
  16  |   { name: "MISCHIEVOUS", id: "69f33df2b5a1600bf78586a2" },
  17  |   { name: "OHANA", id: "6a023755ce6b8709506dfee5" },
  18  |   { name: "VIVA LA VIDA", id: "69f83a8e8ae166becdd09df5" },
  19  | ];
  20  | 
  21  | type Check = { name: string; passed: boolean; detail?: string };
  22  | 
  23  | const collected: Array<{ yachtId: string; yachtName: string; viewport: string; checks: Check[]; pageErrors: string[] }> = [];
  24  | let currentChecks: Check[] = [];
  25  | let currentErrors: string[] = [];
  26  | 
  27  | async function record(name: string, fn: () => Promise<void>) {
  28  |   try {
  29  |     await fn();
  30  |     currentChecks.push({ name, passed: true });
  31  |   } catch (err) {
  32  |     currentChecks.push({ name, passed: false, detail: err instanceof Error ? err.message.slice(0, 300) : "failed" });
  33  |     throw err;
  34  |   }
  35  | }
  36  | 
  37  | test.beforeEach(() => {
  38  |   currentChecks = [];
  39  |   currentErrors = [];
  40  | });
  41  | 
  42  | // One representative yacht per commit for routine regression checks; the full
  43  | // set runs when PLAYWRIGHT_FULL=1 (e.g. after a deployment or manually).
  44  | const SAMPLE = process.env.PLAYWRIGHT_FULL === "1" ? YACHTS : [YACHTS[0]];
  45  | 
  46  | for (const yacht of SAMPLE) {
  47  |   test.describe(`${yacht.name} customer-facing checks`, () => {
  48  |     test.describe.configure({ retries: 0 });
  49  | 
  50  |     test.afterEach(async ({}, testInfo) => {
  51  |       if (testInfo.status === testInfo.expectedStatus) {
  52  |         collected.push({
  53  |           yachtId: yacht.id,
  54  |           yachtName: yacht.name,
  55  |           viewport: testInfo.project.name,
  56  |           checks: currentChecks,
  57  |           pageErrors: currentErrors,
  58  |         });
  59  |       }
  60  |     });
  61  | 
  62  |     test("yacht page renders CYA content", async ({ page }, testInfo) => {
  63  |       const errors: string[] = [];
  64  |       page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
  65  |       page.on("console", (m) => {
  66  |         if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`);
  67  |       });
  68  | 
  69  |       await record("page loads", async () => {
  70  |         const response = await page.goto(`${BASE_URL}/charter-yachts/${yacht.id}`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  71  |         expect(response?.status(), "page HTTP status").toBeLessThan(400);
  72  |       });
  73  | 
  74  |       await record("main yacht photographs render", async () => {
  75  |         const imgs = page.locator("img");
  76  |         const count = await imgs.count();
  77  |         expect(count, "image count on page").toBeGreaterThan(0);
  78  |       });
  79  | 
  80  |       await record("specifications visible", async () => {
  81  |         await expect(page.getByText(/guests/i).first()).toBeVisible();
  82  |         await expect(page.getByText(/cabin/i).first()).toBeVisible();
  83  |       });
  84  | 
  85  |       const diningVisible = await page.locator("#dining").isVisible().catch(() => false);
  86  | 
  87  |       if (diningVisible) {
  88  |         await record("dining section reachable by scrolling", async () => {
  89  |           await page.locator("#dining").scrollIntoViewIfNeeded();
  90  |           const box = await page.locator("#dining").boundingBox();
  91  |           expect(box, "dining heading renders with a real box after scrolling").not.toBeNull();
  92  |           expect(box!.height, "dining heading height").toBeGreaterThan(0);
  93  |         });
  94  |         await record("dining photographs have captions", async () => {
  95  |           const figures = page.locator("figure:has(img)");
  96  |           const n = await figures.count();
  97  |           expect(n, "figure count in dining area").toBeGreaterThan(0);
  98  |         });
  99  |         await record("all dining photographs load", async () => {
  100 |           const dining = page.locator("section:has(#dining)");
  101 |           const imgs = dining.locator("img");
  102 |           const n = await imgs.count();
  103 |           expect(n, "dining image count").toBeGreaterThan(0);
  104 |           for (let i = 0; i < Math.min(n, 20); i++) {
  105 |             const img = imgs.nth(i);
  106 |             const ok = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
> 107 |             expect(ok, `dining image ${i} loads`).toBe(true);
      |                                                   ^ Error: dining image 0 loads
  108 |           }
  109 |         });
  110 |         await record("no literal HTML entities in dining text", async () => {
  111 |           const text = await page.locator("section:has(#dining)").innerText();
  112 |           expect(text).not.toMatch(/&bull;|&amp;bull;|&lt;p&gt;|&lt;br/);
  113 |         });
  114 |         await record("lightbox opens and closes", async () => {
  115 |           const trigger = page.locator("section:has(#dining) figure button").first();
  116 |           if (await trigger.isVisible()) {
  117 |             await trigger.click();
  118 |             const dialog = page.locator('[role="dialog"]');
  119 |             await expect(dialog).toBeVisible();
  120 |             await dialog.click({ position: { x: 10, y: 10 } });
  121 |             await expect(dialog).toBeHidden();
  122 |           }
  123 |         });
  124 |         await record("no empty menu-description cards", async () => {
  125 |           const empty = await page.evaluate(() => {
  126 |             const cards = document.querySelectorAll("section article");
  127 |             let bad = 0;
  128 |             cards.forEach((c) => {
  129 |               const t = (c.textContent ?? "").trim();
  130 |               const hasImg = c.querySelector("img") !== null;
  131 |               if (!hasImg && t.length === 0) bad += 1;
  132 |             });
  133 |             return bad;
  134 |           });
  135 |           expect(empty, "empty cards").toBe(0);
  136 |         });
  137 |       } else {
  138 |         currentChecks.push({ name: "dining section (CYA supplies none — hidden is correct)", passed: true });
  139 |       }
  140 | 
  141 |       await record("no browser page errors", async () => {
  142 |         expect(errors, `browser errors: ${errors.join(" | ").slice(0, 400)}`).toHaveLength(0);
  143 |       });
  144 |       currentErrors.push(...errors);
  145 | 
  146 |       await record("no horizontal overflow", async () => {
  147 |         const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  148 |         expect(overflow, "horizontal overflow px").toBeLessThanOrEqual(1);
  149 |       });
  150 |     });
  151 |   });
  152 | }
  153 | 
  154 | // ENDLESS HORIZON-specific dining requirements (chef intro, five photos).
  155 | test.describe("ENDLESS HORIZON dining specifics", () => {
  156 |   test("chef introduction and five distinct photographs", async ({ page }) => {
  157 |     const checks: Check[] = [];
  158 |     const errors: string[] = [];
  159 |     page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
  160 |     page.on("console", (m) => {
  161 |       if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`);
  162 |     });
  163 |     const rec = async (name: string, fn: () => Promise<void>) => {
  164 |       try {
  165 |         await fn();
  166 |         checks.push({ name, passed: true });
  167 |       } catch (err) {
  168 |         checks.push({ name, passed: false, detail: err instanceof Error ? err.message.slice(0, 300) : "failed" });
  169 |         throw err;
  170 |       }
  171 |     };
  172 |     await page.goto(`${BASE_URL}/charter-yachts/69f33df0b5a1600bf785869e`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  173 |     await page.locator("#dining").scrollIntoViewIfNeeded();
  174 |     // Lazy-loaded images only start after the scroll; the hero video streams
  175 |     // continuously so networkidle never fires — wait on image completion.
  176 |     await page
  177 |       .waitForFunction(
  178 |         () => {
  179 |           const imgs = document.querySelector("#dining")?.closest("section")?.querySelectorAll("img");
  180 |           if (!imgs || imgs.length === 0) return false;
  181 |           return Array.from(imgs).every((img) => (img as HTMLImageElement).complete);
  182 |         },
  183 |         { timeout: 15_000 }
  184 |       )
  185 |       .catch(() => {});
  186 |     await rec("dining section present", async () => {
  187 |       await page.locator("#dining").scrollIntoViewIfNeeded();
  188 |       const box = await page.locator("#dining").boundingBox();
  189 |       expect(box, "dining heading renders with a real box after scrolling").not.toBeNull();
  190 |     });
  191 |     await rec("chef introduction displayed", async () => {
  192 |       await page.getByText(/Heather Arndt/i).first().scrollIntoViewIfNeeded();
  193 |       const text = await page.locator("section:has(#dining)").innerText();
  194 |       expect(text).toMatch(/Heather Arndt/i);
  195 |     });
  196 |     await rec("all dining photographs load", async () => {
  197 |       const urls = await page.evaluate(() => {
  198 |         const dining = document.querySelector("#dining")?.closest("section");
  199 |         const out = new Set<string>();
  200 |         dining?.querySelectorAll("img").forEach((img) => {
  201 |           const el = img as HTMLImageElement;
  202 |           if (el.complete && el.naturalWidth > 0 && el.src) out.add(el.src);
  203 |         });
  204 |         return Array.from(out);
  205 |       });
  206 |       expect(urls.length, "distinct loaded dining image URLs").toBeGreaterThanOrEqual(5);
  207 |     });
```