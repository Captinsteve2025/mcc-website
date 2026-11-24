# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-verification.spec.ts >> ENDLESS HORIZON customer-facing checks >> yacht page renders CYA content
- Location: tests/browser-verification.spec.ts:62:5

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.count: Target page, context or browser has been closed
```

# Test source

```ts
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
  101 |           await dining.scrollIntoViewIfNeeded();
  102 |           // Lazy images only start after the scroll; give them a bounded window.
  103 |           await page
  104 |             .waitForFunction(
  105 |               () => {
  106 |                 const imgs = document.querySelector("#dining")?.closest("section")?.querySelectorAll("img");
  107 |                 if (!imgs || imgs.length === 0) return false;
  108 |                 return Array.from(imgs).every((img) => (img as HTMLImageElement).complete);
  109 |               },
  110 |               { timeout: 10_000 }
  111 |             )
  112 |             .catch(() => {});
  113 |           const imgs = dining.locator("img");
> 114 |           const n = await imgs.count();
      |                                ^ Error: locator.count: Target page, context or browser has been closed
  115 |           expect(n, "dining image count").toBeGreaterThan(0);
  116 |           for (let i = 0; i < Math.min(n, 20); i++) {
  117 |             const img = imgs.nth(i);
  118 |             const ok = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
  119 |             expect(ok, `dining image ${i} loads`).toBe(true);
  120 |           }
  121 |         });
  122 |         await record("no literal HTML entities in dining text", async () => {
  123 |           const text = await page.locator("section:has(#dining)").innerText();
  124 |           expect(text).not.toMatch(/&bull;|&amp;bull;|&lt;p&gt;|&lt;br/);
  125 |         });
  126 |         await record("lightbox opens and closes", async () => {
  127 |           const trigger = page.locator("section:has(#dining) figure button").first();
  128 |           if (await trigger.isVisible()) {
  129 |             await trigger.click();
  130 |             const dialog = page.locator('[role="dialog"]');
  131 |             await expect(dialog).toBeVisible();
  132 |             await dialog.click({ position: { x: 10, y: 10 } });
  133 |             await expect(dialog).toBeHidden();
  134 |           }
  135 |         });
  136 |         await record("no empty menu-description cards", async () => {
  137 |           const empty = await page.evaluate(() => {
  138 |             const cards = document.querySelectorAll("section article");
  139 |             let bad = 0;
  140 |             cards.forEach((c) => {
  141 |               const t = (c.textContent ?? "").trim();
  142 |               const hasImg = c.querySelector("img") !== null;
  143 |               if (!hasImg && t.length === 0) bad += 1;
  144 |             });
  145 |             return bad;
  146 |           });
  147 |           expect(empty, "empty cards").toBe(0);
  148 |         });
  149 |       } else {
  150 |         currentChecks.push({ name: "dining section (CYA supplies none — hidden is correct)", passed: true });
  151 |       }
  152 | 
  153 |       await record("no browser page errors", async () => {
  154 |         expect(errors, `browser errors: ${errors.join(" | ").slice(0, 400)}`).toHaveLength(0);
  155 |       });
  156 |       currentErrors.push(...errors);
  157 | 
  158 |       await record("no horizontal overflow", async () => {
  159 |         const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  160 |         expect(overflow, "horizontal overflow px").toBeLessThanOrEqual(1);
  161 |       });
  162 |     });
  163 |   });
  164 | }
  165 | 
  166 | // ENDLESS HORIZON-specific dining requirements (chef intro, five photos).
  167 | test.describe("ENDLESS HORIZON dining specifics", () => {
  168 |   test("chef introduction and five distinct photographs", async ({ page }) => {
  169 |     const checks: Check[] = [];
  170 |     const errors: string[] = [];
  171 |     page.on("pageerror", (e) => errors.push(`pageerror: ${e.message.slice(0, 200)}`));
  172 |     page.on("console", (m) => {
  173 |       if (m.type() === "error") errors.push(`console.error: ${m.text().slice(0, 200)}`);
  174 |     });
  175 |     const rec = async (name: string, fn: () => Promise<void>) => {
  176 |       try {
  177 |         await fn();
  178 |         checks.push({ name, passed: true });
  179 |       } catch (err) {
  180 |         checks.push({ name, passed: false, detail: err instanceof Error ? err.message.slice(0, 300) : "failed" });
  181 |         throw err;
  182 |       }
  183 |     };
  184 |     await page.goto(`${BASE_URL}/charter-yachts/69f33df0b5a1600bf785869e`, { waitUntil: "domcontentloaded", timeout: 30_000 });
  185 |     await page.locator("#dining").scrollIntoViewIfNeeded();
  186 |     // Lazy-loaded images only start after the scroll; the hero video streams
  187 |     // continuously so networkidle never fires — wait on image completion.
  188 |     await page
  189 |       .waitForFunction(
  190 |         () => {
  191 |           const imgs = document.querySelector("#dining")?.closest("section")?.querySelectorAll("img");
  192 |           if (!imgs || imgs.length === 0) return false;
  193 |           return Array.from(imgs).every((img) => (img as HTMLImageElement).complete);
  194 |         },
  195 |         { timeout: 15_000 }
  196 |       )
  197 |       .catch(() => {});
  198 |     await rec("dining section present", async () => {
  199 |       await page.locator("#dining").scrollIntoViewIfNeeded();
  200 |       const box = await page.locator("#dining").boundingBox();
  201 |       expect(box, "dining heading renders with a real box after scrolling").not.toBeNull();
  202 |     });
  203 |     await rec("chef introduction displayed", async () => {
  204 |       await page.getByText(/Heather Arndt/i).first().scrollIntoViewIfNeeded();
  205 |       const text = await page.locator("section:has(#dining)").innerText();
  206 |       expect(text).toMatch(/Heather Arndt/i);
  207 |     });
  208 |     await rec("all dining photographs load", async () => {
  209 |       const urls = await page.evaluate(() => {
  210 |         const dining = document.querySelector("#dining")?.closest("section");
  211 |         const out = new Set<string>();
  212 |         dining?.querySelectorAll("img").forEach((img) => {
  213 |           const el = img as HTMLImageElement;
  214 |           if (el.complete && el.naturalWidth > 0 && el.src) out.add(el.src);
```