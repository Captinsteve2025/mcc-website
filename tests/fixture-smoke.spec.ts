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

test("shows at most three comparable yachts and carries the party's search", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const yachtUrl = "/charter-yachts/aaaaaaaaaaaaaaaaaaaaaaaa";
  await page.goto(yachtUrl);
  const recommendations = page.getByRole("region", { name: "Similar Yachts" });
  await expect(page.getByText("Up to 8 adults", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Guests 9 and 10 must be under 10 and require prior approval.")).toBeVisible();
  await expect(recommendations.getByRole("heading", { level: 3 })).toHaveText([
    "Closest Match", "Second Match", "Third Match",
  ]);
  await expect(recommendations.getByText("Shared cruising area: British Virgin Islands")).toHaveCount(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);

  await page.goto(`${yachtUrl}?guests=10&start=2027-02-01`);
  await expect(recommendations.getByRole("heading", { level: 3 })).toHaveText(["Broader Match"]);
  await expect(recommendations.getByText("Broader alternative", { exact: true })).toBeVisible();
  await expect(recommendations.getByRole("link")).toHaveAttribute(
    "href", "/charter-yachts/222222222222222222222222?start=2027-02-01&guests=10",
  );

  await page.goto(`${yachtUrl}?guests=12`);
  await expect(recommendations).toHaveCount(0);
});

test("keeps the gallery high on the page and the desktop calendar inside its panel", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/charter-yachts/aaaaaaaaaaaaaaaaaaaaaaaa");
  expect(await page.locator("#gallery").evaluate((element) => element.getBoundingClientRect().top)).toBeLessThan(350);
  const calendar = page.locator("#availability").getByRole("grid");
  await expect(calendar).toHaveCount(1);
  expect(await calendar.evaluate((grid) => {
    const bounds = grid.getBoundingClientRect();
    return Array.from(grid.querySelectorAll("button")).every((button) => {
      const rect = button.getBoundingClientRect();
      return rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1;
    });
  })).toBe(true);
  await expect(page.getByText("Engines", { exact: true })).toBeVisible();
  await expect(page.getByText("Fuel consumption", { exact: true })).toHaveCount(0);
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
