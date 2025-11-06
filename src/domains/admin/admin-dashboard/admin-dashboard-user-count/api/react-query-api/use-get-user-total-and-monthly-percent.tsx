import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserTotalAndMonthlyPercent } from "@admin/admin-dashboard/admin-dashboard-user-count/api/admin-dashboard-user-count-api";
import { ADMIN_DASHBOARD_USER_COUNT_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-user-count/api/react-query-api/admin-dashboard-user-count-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetUserTotalAndMonthlyPercentSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_USER_COUNT_QUERY_KEYS.USER_TOTAL_AND_MONTHLY_PERCENT],
    queryFn: async () => {
      const response = await getUserTotalAndMonthlyPercent();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
