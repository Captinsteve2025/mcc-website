import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  // These pages are very long (hero video streams continuously; 20k+ px of
  // content), so each test needs more than the default budget.
  timeout: 120_000,
  retries: 1,
  fullyParallel: false,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "https://mcc-website-one.vercel.app",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Chromium-based mobile emulation: a real mobile viewport and touch, without
    // requiring a second browser engine download in constrained environments.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
    // Real WebKit (Safari engine) for iPhone-width verification — catches
    // Safari-only layout behaviour Chromium masks. Install with
    // `npx playwright install webkit`; skipped gracefully when absent.
    {
      name: "mobile-webkit",
      use: {
        ...devices["iPhone 14"],
        // WebKit cannot fetch remote CYA images with HTTP credentials off in CI;
        // defaults are fine here.
      },
    },
  ],
});
