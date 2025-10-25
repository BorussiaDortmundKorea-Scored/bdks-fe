/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminDashboardMatchStatsDummy from "@admin/admin-dashboard/admin-dashboard-match-stats/mocks/admin-dashboard-match-stats-dummy.json";

export const AdminDashboardMatchStatsHandlers = [
  http.post("*/rest/v1/rpc/get_match_rating_stats", ({ request }) => {
    console.log("MSW: RPC 요청 가로챔! get_match_rating_stats", request.url);
    return HttpResponse.json(AdminDashboardMatchStatsDummy);
  }),
];

