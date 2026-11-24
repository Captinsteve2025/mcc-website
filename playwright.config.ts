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
  ],
});
