/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminDashboardMatchParticipationTrendDummy from "@admin/admin-dashboard/admin-dashboard-rating-trend/mocks/admin-dashboard-match-participation-trend-dummy.json";
import AdminDashboardMonthlyRatingTrendDummy from "@admin/admin-dashboard/admin-dashboard-rating-trend/mocks/admin-dashboard-monthly-rating-trend-dummy.json";

export const AdminDashboardRatingTrendHandlers = [
  http.post("*/rest/v1/rpc/get_monthly_rating_trend", () => {
    return HttpResponse.json(AdminDashboardMonthlyRatingTrendDummy);
  }),
  http.post("*/rest/v1/rpc/get_match_participation_trend", () => {
    return HttpResponse.json(AdminDashboardMatchParticipationTrendDummy);
  }),
];
