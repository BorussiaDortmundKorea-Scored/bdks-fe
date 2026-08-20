import { useSuspenseQuery } from "@tanstack/react-query";

import { getRatingParticipation } from "@admin/admin-dashboard/admin-dashboard-rating-participation/api/admin-dashboard-rating-participation-api";
import { ADMIN_DASHBOARD_RATING_PARTICIPATION_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-rating-participation/api/react-query-api/admin-dashboard-rating-participation-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetRatingParticipationSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_RATING_PARTICIPATION_QUERY_KEYS.RATING_PARTICIPATION],
    queryFn: async () => {
      const response = await getRatingParticipation();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  const { data } = query;

  return { data };
}
