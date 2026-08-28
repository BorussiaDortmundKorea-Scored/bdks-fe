import { loginAnonymously } from "./helpers/auth";
import { test as setup } from "@playwright/test";

const AUTH_FILE = "e2e/.auth/user.json";

/**
 * 익명로그인 1회 수행 후 세션(localStorage)을 storageState로 저장.
 * 이후 모든 테스트가 이 세션을 재사용하므로 테스트마다 신규 유저를 만들지 않는다.
 */
setup("익명 로그인 세션 준비", async ({ page }) => {
  await loginAnonymously(page);
  await page.context().storageState({ path: AUTH_FILE });
});
