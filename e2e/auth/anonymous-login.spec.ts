import { expect, test } from "@playwright/test";

test.describe("익명 로그인 플로우", () => {
  test("익명 로그인 → 닉네임 설정 → 대시보드 이동", async ({ page }) => {
    // 1. 로그인 페이지에서 익명 로그인
    await page.goto("/");
    await page.getByRole("button", { name: "일회용 로그인" }).click();

    // 2. 닉네임 설정 페이지 도착 확인
    await expect(page).toHaveURL(/auth\/profile/);

    // 3. 닉네임 입력
    const nickname = `playwright_${Date.now()}`;
    await page.getByLabel("사용할 닉네임").fill(nickname);

    // 4. 최애 선수 선택 (SelectBox 열기 → 첫 번째 옵션 선택)
    await page.getByRole("combobox").click();
    await page.getByRole("option").first().click();

    // 5. 프로필 설정 버튼 클릭
    await page.getByRole("button", { name: "프로필 설정" }).click();

    // 6. 대시보드 도착 확인
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  });
});
