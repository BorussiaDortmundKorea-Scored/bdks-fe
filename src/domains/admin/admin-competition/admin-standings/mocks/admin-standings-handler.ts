/**
 * 작성자: KYD
 * 기능: 리그 순위 조회 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminStandingsDummy from "@admin/admin-competition/admin-standings/mocks/admin-standings-dummy.json";

export const AdminStandingsHandlers = [
  http.post("*/rest/v1/rpc/get_standings", () => {
    return HttpResponse.json(AdminStandingsDummy);
  }),
];
