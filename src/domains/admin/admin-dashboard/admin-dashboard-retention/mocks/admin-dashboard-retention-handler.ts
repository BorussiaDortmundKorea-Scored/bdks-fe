/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 조회 MSW 핸들러
 */
import { HttpResponse, http } from "msw";

import AdminDashboardRetentionDummy from "@admin/admin-dashboard/admin-dashboard-retention/mocks/admin-dashboard-retention-dummy.json";

export const AdminDashboardRetentionHandlers = [
  http.post("*/rest/v1/rpc/get_user_retention_funnel", () => {
    return HttpResponse.json(AdminDashboardRetentionDummy);
  }),
];
