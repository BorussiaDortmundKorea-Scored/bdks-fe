/**
 * 작성자: KYD
 * 기능: 평점 분포 / 시간대별 입력량 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getRatingStats } from "@admin/admin-dashboard/admin-dashboard-rating-distribution/api/admin-dashboard-rating-distribution-api";
import { ADMIN_DASHBOARD_RATING_DISTRIBUTION_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-rating-distribution/api/react-query-api/admin-dashboard-rating-distribution-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetRatingStats() {
  const { data } = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_RATING_DISTRIBUTION_QUERY_KEYS.RATING_STATS],
    queryFn: async () => {
      const response = await getRatingStats();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5,
  });

  return data;
}
