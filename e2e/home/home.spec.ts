import { expect, test } from "@playwright/test";

test.describe("로그인(메인) 페이지", () => {
  test("페이지 타이틀이 보돌코 스코어드가 보인다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("보돌코 스코어드");
  });

  test("로고 heading이 보인다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "보돌코 스코어드" })).toBeVisible();
  });

  test("로그인 버튼들이 보인다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "카카오 로그인" })).toBeVisible();
    await expect(page.getByRole("button", { name: "일회용 로그인" })).toBeVisible();
  });

  test("저작권 문구가 보인다", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/비영리적 목적/)).toBeVisible();
  });
});
