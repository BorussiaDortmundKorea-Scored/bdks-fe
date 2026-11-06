import { expect, test } from "@playwright/test";

const ADMIN_USER_ID = "00000000-0000-4000-8000-000000000001";

const MATCHES = [
  {
    id: "past-match",
    competition_id: "competition-1",
    opponent_team_id: "team-1",
    match_date: "2000-01-01",
    home_away: "HOME",
    our_score: 2,
    opponent_score: 0,
    formation: null,
    is_live: false,
    round_name: "지난 경기",
    match_start_time: null,
    second_half_start_time: null,
    first_half_end_time: null,
    second_half_end_time: null,
    created_at: null,
    updated_at: null,
    competition_name: "테스트 리그",
    opponent_team_name: "과거 팀",
  },
  {
    id: "upcoming-match",
    competition_id: "competition-1",
    opponent_team_id: "team-2",
    match_date: "2099-01-01",
    home_away: "AWAY",
    our_score: 0,
    opponent_score: 0,
    formation: null,
    is_live: false,
    round_name: "예정 경기",
    match_start_time: null,
    second_half_start_time: null,
    first_half_end_time: null,
    second_half_end_time: null,
    created_at: null,
    updated_at: null,
    competition_name: "테스트 컵",
    opponent_team_name: "예정 팀",
  },
];

const createAdminSession = () => {
  const payload = btoa(
    JSON.stringify({
      sub: ADMIN_USER_ID,
      aud: "authenticated",
      role: "authenticated",
      exp: 4102444800,
      iat: 2000000000,
    }),
  );

  return JSON.stringify({
    access_token: `e30.${payload}.e2e`,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: 4102444800,
    refresh_token: "e2e-refresh-token",
    user: { id: ADMIN_USER_ID, aud: "authenticated", role: "authenticated", email: "admin@example.com" },
  });
};

test.describe("admin match filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((session) => {
      localStorage.setItem("sb-cbslhrnoayazuoyukqxg-auth-token", session);
      localStorage.setItem("sb-abxgeyabzwzrorecsjcdg-auth-token", session);
    }, createAdminSession());

    await page.route("**/rest/v1/profiles**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ id: ADMIN_USER_ID, nickname: "e2e-admin", is_admin: true }),
      });
    });
    await page.route("**/rest/v1/rpc/get_all_matches", async (route) => {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(MATCHES) });
    });
  });

  test("desktop: defaults to upcoming matches and filters by tabs", async ({ page }) => {
    await page.goto("/admin/match");

    await expect(page.getByRole("heading", { name: "경기 관리" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "예정" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("cell", { name: "예정 경기" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "지난 경기" })).toHaveCount(0);

    await page.getByRole("radio", { name: "지난 경기" }).click();
    await expect(page.getByRole("cell", { name: "지난 경기" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "예정 경기" })).toHaveCount(0);
  });

  test("keeps the selected filter after reload (sessionStorage)", async ({ page }) => {
    await page.goto("/admin/match");
    await page.getByRole("radio", { name: "지난 경기" }).click();

    await page.reload();

    await expect(page.getByRole("radio", { name: "지난 경기" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("cell", { name: "지난 경기" })).toBeVisible();
  });

  test("mobile: header stays on one line without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/admin/match");

    const heading = page.getByRole("heading", { name: "경기 관리" });
    const addButton = page.getByRole("button", { name: "새 경기 추가" });
    await expect(heading).toBeVisible();
    await expect(addButton).toBeVisible();
    const filterScroll = page
      .getByRole("region", { name: "횡스크롤 영역" })
      .filter({ has: page.getByRole("radio", { name: "예정" }) });
    await expect(filterScroll).toBeVisible();

    // 제목·필터·버튼이 같은 줄(세로 중심이 같은 높이)에 있어야 한다
    const headingBox = await heading.boundingBox();
    const filterBox = await filterScroll.boundingBox();
    const addBox = await addButton.boundingBox();
    const centerY = (box: { y: number; height: number } | null) => (box ? box.y + box.height / 2 : NaN);
    expect(Math.abs(centerY(headingBox) - centerY(filterBox))).toBeLessThan(8);
    expect(Math.abs(centerY(addBox) - centerY(filterBox))).toBeLessThan(8);

    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBe(false);
  });
});
