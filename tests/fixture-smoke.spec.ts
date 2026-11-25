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
  await expect(page.getByText("Guests 9 and 10 are subject to the under-10 rule. Please confirm approval requirements with our charter team.")).toBeVisible();
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


test("keeps the hold panel and proposal aligned and carries dates to the proposal", async ({ page, isMobile }) => {
  if (isMobile) await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/charter-yachts/aaaaaaaaaaaaaaaaaaaaaaaa");
  await page.getByText("Weekly rates by guest count", { exact: true }).click();
  const rates = page.getByRole("table", { name: "Fixture season weekly rates by guest count" });
  await expect(rates.getByRole("row", { name: "10 $15,500" })).toBeVisible();
  await expect(rates.getByRole("row")).toHaveCount(3);
  await expect(page.getByText("Plus 5% APA")).toBeVisible();

  await page.getByText("Charter rules & rate notes", { exact: true }).click();
  await expect(page.getByText("Minimum seven nights. Confirm holiday dates before booking.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "A great week | May 1–8, 2026" })).toBeVisible();
  await expect(page.getByText("Wonderful crew & sailing.")).toBeVisible();
  await expect(page.getByText("unexpected content")).toHaveCount(0);
  await expect(page.getByLabel("Number of guests")).toHaveAttribute("max", "10");
  await page.getByLabel("Number of guests").fill("11");
  await page.getByRole("button", { name: "Check availability & get my proposal" }).click();
  await expect(page.getByText("Please enter the number of guests (1 to 10).")).toBeVisible();

  const hold = page.getByRole("region", { name: "Request a hold" });
  const holdDates = hold.locator("dd");
  await expect(page.locator("#availability + section")).toHaveAttribute("aria-labelledby", "request-hold-title");
  await expect(holdDates).toHaveText("Choose dates in the calendar");
  await expect(hold.getByRole("button")).toHaveCount(0);

  const selectDate = async (offset: number) => {
    const iso = new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
    const day = page.getByRole("button", { name: `${iso}: contact us to confirm`, exact: true });
    if (!(await day.isVisible())) await page.getByRole("button", { name: "Next month" }).click();
    await day.click();
    return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
      timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
    });
  };
  const start = await selectDate(1);
  const end = await selectDate(2);
  await expect(holdDates).toHaveText(`${start} to ${end}`);
  await expect(page.getByLabel(/Preferred charter dates/)).toHaveValue(`${start} to ${end}`);
  await expect(hold.getByText("Direct hold requests are currently unavailable.")).toBeVisible();
  await hold.getByRole("link", { name: "Ask about these dates" }).click();
  await expect(page).toHaveURL(/#enquire$/);
  await expect(page.locator("#enquire")).toBeFocused();
  await expect(page.getByRole("status").filter({ hasText: "published 72-hour turnaround" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Continue to proposal form" })).toBeVisible();

  const nextStart = await selectDate(3);
  await expect(holdDates).toHaveText("Choose dates in the calendar");
  const nextEnd = await selectDate(4);
  await expect(holdDates).toHaveText(`${nextStart} to ${nextEnd}`);
  await expect(hold.getByRole("link", { name: "Ask about these dates" })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(async () => page.evaluate(() => {
    const proposal = document.querySelector("#enquire")!.getBoundingClientRect();
    const availability = document.querySelector("#availability")!.parentElement!.getBoundingClientRect();
    return proposal.top > availability.bottom && Math.abs(proposal.left - availability.left) <= 1
      && Math.abs(proposal.right - availability.right) <= 1;
  })).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
});
