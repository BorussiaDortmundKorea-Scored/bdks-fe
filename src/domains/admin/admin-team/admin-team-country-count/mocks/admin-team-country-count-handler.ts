/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 조회 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminTeamCountryCountDummy from "@admin/admin-team/admin-team-country-count/mocks/admin-team-country-count-dummy.json";

export const AdminTeamCountryCountHandlers = [
  http.post("*/rest/v1/rpc/get_team_count_by_country", () => {
    return HttpResponse.json(AdminTeamCountryCountDummy);
  }),
];
