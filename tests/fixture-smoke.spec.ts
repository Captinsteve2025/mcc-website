import { expect, test } from "@playwright/test";

const image = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aV1sAAAAASUVORK5CYII=",
  "base64",
);

test.beforeEach(async ({ page, baseURL }) => {
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "fixture-images.invalid" || (url.origin === baseURL && url.pathname === "/_next/image")) {
      return route.fulfill({ contentType: "image/png", body: image });
    }
    if (url.origin === baseURL) return route.continue();
    return route.abort();
  });
});

test("browses the fixture catalogue and opens a yacht", async ({ page }) => {
  const response = await page.goto("/charter-yachts");
  expect(response?.status()).toBe(200);
  await page.getByRole("link", { name: "View Fixture Catamaran" }).click();

  await expect(page.getByRole("heading", { name: "Fixture Catamaran", exact: true })).toBeVisible();
  const hero = page.getByRole("button", { name: /Open photo gallery/ }).first().locator("img");
  await expect.poll(() => hero.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { name: "Rates & Availability" })).toBeVisible();
  await expect(page.locator("#rates").getByText("$12,000 / week", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /^\d{4}-\d{2}-\d{2}: Booked$/ })).toBeVisible();
  await expect(page.getByText("Fixture captain biography.")).toBeVisible();

  const dining = page.locator("section").filter({ has: page.getByRole("heading", { name: "Dining & Cuisine" }) });
  await dining.getByRole("button", { name: "Breakfast" }).click();
  await expect(dining.getByText("Fixture sample menu.")).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("returns 404 for a yacht outside the fixture catalogue", async ({ page }) => {
  const response = await page.goto("/charter-yachts/bbbbbbbbbbbbbbbbbbbbbbbb");
  expect(response?.status()).toBe(404);
});

test("fits yacht brochure text and the training link at 320 pixels", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/charter-yachts/aaaaaaaaaaaaaaaaaaaaaaaa");
  const crewReference = page.getByText("UnbrokenCrewProfileReferenceForNarrowScreenTesting", { exact: true });
  await expect(crewReference).toBeVisible();
  expect(await crewReference.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const bounds = element.getBoundingClientRect();
    return Array.from(range.getClientRects()).every((line) => line.right <= bounds.right + 1);
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);

  await page.goto("/training");
  const licenseLink = page.getByRole("link", { name: "Learn About the SLC License" });
  await expect(licenseLink).toBeVisible();
  const linkRight = await licenseLink.evaluate((element) => element.getBoundingClientRect().right);
  expect(linkRight).toBeLessThanOrEqual(321);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
});
