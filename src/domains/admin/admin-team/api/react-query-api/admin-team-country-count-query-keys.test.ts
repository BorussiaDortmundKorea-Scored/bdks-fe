/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 쿼리 키 — 팀 목록 무효화에 함께 걸리는지 고정하는 테스트
 * 프로세스 설명: 팀 추가·수정·삭제 훅은 [ALL_TEAMS] 만 무효화한다. 국가별 팀 수 차트·팀 현황 카드는
 *              키 앞부분이 같아서 함께 갱신되는데, 이 연결은 주석으로만 보장돼 있었다.
 *              누가 무효화에 exact 를 붙이거나 키 구조를 바꾸면 차트가 조용히 낡으므로 여기서 막는다.
 */
import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY } from "@admin/admin-team/api/react-query-api/admin-team-country-count-query-keys";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

describe("ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY", () => {
  it("팀 mutation 훅이 쓰는 [ALL_TEAMS] 무효화에 국가별 팀 수 쿼리도 함께 무효화된다", async () => {
    const client = new QueryClient();
    client.setQueryData(ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY, []);

    // use-create-team / use-update-team / use-delete-team 과 같은 호출
    await client.invalidateQueries({ queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS] });

    expect(client.getQueryState(ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY)?.isInvalidated).toBe(true);
  });
});
