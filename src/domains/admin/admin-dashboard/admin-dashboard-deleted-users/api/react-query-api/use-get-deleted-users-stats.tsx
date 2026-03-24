import { useSuspenseQuery } from "@tanstack/react-query";

import { getDeletedUsersStats } from "@admin/admin-dashboard/admin-dashboard-deleted-users/api/admin-dashboard-deleted-users-api";
import { ADMIN_DASHBOARD_DELETED_USERS_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-deleted-users/api/react-query-api/admin-dashboard-deleted-users-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetDeletedUsersStatsSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_DELETED_USERS_QUERY_KEYS.DELETED_USERS_STATS],
    queryFn: async () => {
      const response = await getDeletedUsersStats();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
