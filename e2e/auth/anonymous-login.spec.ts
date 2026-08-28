import { loginAnonymously } from "../helpers/auth";
import { expect, test } from "@playwright/test";

test.describe("익명 로그인 플로우", () => {
  // 로그인 플로우 자체를 검증하므로 저장된 세션을 무시하고 로그아웃 상태로 실행
  test.use({ storageState: { cookies: [], origins: [] } });

  test("익명 로그인 → 닉네임 설정 → 대시보드 이동", async ({ page }) => {
    await loginAnonymously(page);
    await expect(page).toHaveURL(/dashboard/);
  });
});
