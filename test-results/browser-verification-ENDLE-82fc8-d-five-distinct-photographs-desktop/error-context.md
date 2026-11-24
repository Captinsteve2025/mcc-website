# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser-verification.spec.ts >> ENDLESS HORIZON dining specifics >> chef introduction and five distinct photographs
- Location: tests/browser-verification.spec.ts:168:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.scrollIntoViewIfNeeded: Target page, context or browser has been closed
```

# Test source

```ts
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
  114 |           const n = await imgs.count();
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
> 199 |       await page.locator("#dining").scrollIntoViewIfNeeded();
      |                                     ^ Error: locator.scrollIntoViewIfNeeded: Target page, context or browser has been closed
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
  215 |         });
  216 |         return Array.from(out);
  217 |       });
  218 |       expect(urls.length, "distinct loaded dining image URLs").toBeGreaterThanOrEqual(5);
  219 |     });
  220 |     currentErrors.push(...errors);
  221 |     collected.push({ yachtId: "69f33df0b5a1600bf785869e", yachtName: "ENDLESS HORIZON", viewport: "dining-specific", checks, pageErrors: errors });
  222 |   });
  223 | });
  224 | 
  225 | // Import collected results into the site-health monitor, one row per yacht+viewport.
  226 | async function importResults() {
  227 |   if (!IMPORT_URL || !IMPORT_TOKEN) return;
  228 |   const byKey = new Map<string, typeof collected[number]>();
  229 |   for (const run of collected) {
  230 |     const key = `${run.yachtId}:${run.viewport}`;
  231 |     const prev = byKey.get(key);
  232 |     if (!prev || run.checks.length > prev.checks.length) byKey.set(key, run);
  233 |   }
  234 |   for (const run of byKey.values()) {
  235 |     const passed = run.checks.every((c) => c.passed);
  236 |     const failures = run.checks.filter((c) => !c.passed).map((c) => `${c.name}: ${c.detail ?? "failed"}`);
  237 |     const payload = {
  238 |       ranAt: new Date().toISOString(),
  239 |       yachtId: run.yachtId,
  240 |       yachtName: run.yachtName,
  241 |       viewport: run.viewport === "mobile" ? "mobile" : "desktop",
  242 |       passed,
  243 |       testsTotal: run.checks.length,
  244 |       testsFailed: run.checks.length - run.checks.filter((c) => c.passed).length,
  245 |       brokenImages: run.checks.filter((c) => c.name.includes("photographs") && !c.passed).length,
  246 |       failures,
  247 |       browserErrors: run.pageErrors,
  248 |       runner: "playwright-github-actions",
  249 |     };
  250 |     try {
  251 |       const res = await fetch(IMPORT_URL, {
  252 |         method: "POST",
  253 |         headers: { "content-type": "application/json", "x-admin-token": IMPORT_TOKEN },
  254 |         body: JSON.stringify(payload),
  255 |       });
  256 |       if (!res.ok) console.error(`import failed for ${run.yachtName} (${run.viewport}): HTTP ${res.status}`);
  257 |     } catch (err) {
  258 |       console.error(`import request failed: ${err instanceof Error ? err.message : err}`);
  259 |     }
  260 |   }
  261 | }
  262 | 
  263 | test.afterAll(async () => {
  264 |   await importResults();
  265 | });
  266 | 
```