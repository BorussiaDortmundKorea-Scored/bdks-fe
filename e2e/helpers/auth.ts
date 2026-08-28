import { type Page, expect } from "@playwright/test";

/**
 * 익명 로그인 → 닉네임/최애선수 설정 → 대시보드 진입까지 수행하는 공통 헬퍼.
 * Supabase 익명 로그인은 호출 시마다 신규 유저를 생성하며, dev(테스트) 서버라 누적돼도 무방.
 */
export const loginAnonymously = async (page: Page): Promise<void> => {
  await page.goto("/");
  await page.getByRole("button", { name: "일회용 로그인" }).click();

  // 닉네임 설정 페이지 (최애 선수는 선택사항이라 생략 → E2E 안정성 확보)
  await expect(page).toHaveURL(/auth\/profile/);
  // 닉네임은 20자 제한 → 짧게 + 병렬 실행 충돌 방지용 랜덤 접미사 (총 ≤ 20자)
  const nickname = `pw_${Date.now().toString().slice(-6)}_${Math.floor(Math.random() * 10000)}`;
  await page.getByLabel("사용할 닉네임").fill(nickname);

  await page.getByRole("button", { name: "프로필 설정" }).click();

  // 대시보드 진입 확인
  await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
};
