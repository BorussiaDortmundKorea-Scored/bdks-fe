/**
 * 작성자: KYD
 * 기능: 월별 평점 입력량 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getMonthlyRatingTrend } from "@admin/admin-dashboard/admin-dashboard-rating-trend/api/admin-dashboard-rating-trend-api";
import { ADMIN_DASHBOARD_RATING_TREND_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-rating-trend/api/react-query-api/admin-dashboard-rating-trend-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetMonthlyRatingTrendSuspense() {
  const { data } = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_RATING_TREND_QUERY_KEYS.MONTHLY],
    queryFn: async () => {
      const response = await getMonthlyRatingTrend();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5,
  });

  return { data };
}
