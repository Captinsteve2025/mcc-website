import { defineConfig, devices } from "@playwright/test";

const port = 3170;
const baseURL = `http://127.0.0.1:${port}`;
const chromiumPath = process.env.PLAYWRIGHT_LOCAL_CHROMIUM;
const chromiumOptions = chromiumPath ? { launchOptions: { executablePath: chromiumPath } } : {};

export default defineConfig({
  testDir: "./tests",
  testMatch: "fixture-smoke.spec.ts",
  outputDir: ".playwright/fixture-results",
  reporter: [["list"], ["html", { open: "never", outputFolder: ".playwright/fixture-report" }]],
  use: { baseURL, trace: "retain-on-failure" },
  webServer: {
    command: `node --require ./tests/fixtures/cya.cjs ./node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    env: {
      CYA_API_BASE: "https://cya-fixture.invalid",
      CYA_API_KEY: "fixture",
      CYA_ALLOWED_ORIGIN: baseURL,
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "",
    },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...chromiumOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...chromiumOptions } },
    { name: "mobile-webkit", use: { ...devices["iPhone 14"] } },
  ],
});
