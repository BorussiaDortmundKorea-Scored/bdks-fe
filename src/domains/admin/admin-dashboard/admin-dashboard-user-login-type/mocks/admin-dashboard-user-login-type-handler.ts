import { HttpResponse, http } from "msw";

import AdminDashboardUserLoginTypeDummy from "@admin/admin-dashboard/admin-dashboard-user-login-type/mocks/admin-dashboard-user-login-type-dummy.json";

export const AdminDashboardUserLoginTypeHandlers = [
  http.post("*/rest/v1/rpc/get_user_login_type_counts", () => {
    return HttpResponse.json(AdminDashboardUserLoginTypeDummy);
  }),
];
