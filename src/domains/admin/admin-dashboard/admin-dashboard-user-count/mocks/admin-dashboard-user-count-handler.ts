import { HttpResponse, http } from "msw";

import AdminDashboardUserCountDummy from "@admin/admin-dashboard/admin-dashboard-user-count/mocks/admin-dashboard-user-count-dummy.json";

export const AdminDashboardUserCountHandlers = [
  http.post("*/rest/v1/rpc/get_user_total_and_monthly_percent", () => {
    return HttpResponse.json(AdminDashboardUserCountDummy);
  }),
];
