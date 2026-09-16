/**
 * 작성자: KYD
 * 기능: 평점 분포 조회 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminDashboardRatingDistributionDummy from "@admin/admin-dashboard/admin-dashboard-rating-distribution/mocks/admin-dashboard-rating-distribution-dummy.json";

export const AdminDashboardRatingDistributionHandlers = [
  http.post("*/rest/v1/rpc/get_rating_stats", () => {
    return HttpResponse.json(AdminDashboardRatingDistributionDummy);
  }),
];
