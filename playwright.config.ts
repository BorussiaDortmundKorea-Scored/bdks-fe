import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./e2e",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "http://localhost:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /*
   * 렌더링 엔진 기준 최소 커버 (한국 사용자 + 모바일 우선):
   * - Blink: Chrome/Edge/네이버 웨일/삼성인터넷 → chromium 하나로 커버
   * - WebKit: iPhone Safari/카카오톡 인앱(iOS) → Mobile Safari로 커버
   * Firefox(Gecko)·Edge/Chrome 채널(Blink 중복)은 상시 실행에서 제외.
   *
   * setup 프로젝트에서 익명로그인 1회 → storageState 저장 → 나머지 프로젝트가 재사용.
   * 덕분에 테스트 수가 늘어도 dev에 생성되는 유저 수는 (테스트 수와 무관하게) 일정하게 유지됨.
   */
  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], storageState: "e2e/.auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"], storageState: "e2e/.auth/user.json" },
      dependencies: ["setup"],
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"], storageState: "e2e/.auth/user.json" },
      dependencies: ["setup"],
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "pnpm run dev:dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
