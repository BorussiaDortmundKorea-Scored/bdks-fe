import { expect, test } from "@playwright/test";

// storageState(익명 세션)를 재사용하므로 로그인 없이 대시보드에 바로 접근한다.
test.describe("대시보드 렌더링", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
  });

  test("헤더와 주요 섹션(최근 경기 / 선수 평점)이 보인다", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "보돌코 스코어드" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "최근 경기" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "선수 평점" })).toBeVisible();
  });

  test("선수 평점 목록의 선수 카드를 클릭하면 선수 스탯 페이지로 이동한다", async ({ page }) => {
    // 선수 스탯 링크(/stats로 끝남) 클릭 → 스탯 페이지 이동
    // (최근 경기 포메이션의 평점입력 링크 /match/.../player/.../ratings 와 구분)
    const firstPlayerStatsLink = page.locator('a[href$="/stats"]').first();
    await firstPlayerStatsLink.scrollIntoViewIfNeeded();
    await firstPlayerStatsLink.click();

    await expect(page).toHaveURL(/\/player\/[0-9a-f-]+\/stats/, { timeout: 15000 });
  });
});
