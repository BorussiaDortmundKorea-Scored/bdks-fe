/**
 * 작성자: KYD
 * 기능: 경기 일정(get_upcoming_matches) MSW 핸들러
 * 프로세스 설명: 예정 경기 목록과 상대팀 로고 매핑용 get_all_teams 를 함께 목킹한다.
 */
import { HttpResponse, http } from "msw";

import DashboardFixturesDummy from "@dashboard/dashboard-fixtures/mocks/dashboard-fixtures-dummy.json";
import DashboardFixturesTeamsDummy from "@dashboard/dashboard-fixtures/mocks/dashboard-fixtures-teams-dummy.json";

export const DashboardFixturesHandlers = [
  http.post("*/rest/v1/rpc/get_upcoming_matches", () => {
    return HttpResponse.json(DashboardFixturesDummy);
  }),
  http.post("*/rest/v1/rpc/get_all_teams", () => {
    return HttpResponse.json(DashboardFixturesTeamsDummy);
  }),
];
