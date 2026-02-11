import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserLoginTypeCounts } from "@admin/admin-dashboard/admin-dashboard-user-login-type/api/admin-dashboard-user-login-type-api";
import { ADMIN_DASHBOARD_USER_LOGIN_TYPE_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-user-login-type/api/react-query-api/admin-dashboard-user-login-type-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetUserLoginTypeCountsSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_USER_LOGIN_TYPE_QUERY_KEYS.USER_LOGIN_TYPE_COUNTS],
    queryFn: async () => {
      const response = await getUserLoginTypeCounts();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
