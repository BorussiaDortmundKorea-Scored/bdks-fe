/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 조회 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminDashboardMatchOverviewDummy from "@admin/admin-dashboard/admin-dashboard-match-overview/mocks/admin-dashboard-match-overview-dummy.json";

export const AdminDashboardMatchOverviewHandlers = [
  http.post("*/rest/v1/rpc/get_match_overview", () => {
    return HttpResponse.json(AdminDashboardMatchOverviewDummy);
  }),
];
