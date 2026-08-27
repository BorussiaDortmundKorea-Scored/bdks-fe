/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 조회 React Query 훅
 */
import { getMatchOverview } from "../admin-dashboard-match-overview-api";
import { adminDashboardMatchOverviewKeys } from "./admin-dashboard-match-overview-query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useGetMatchOverview = () => {
  const { data } = useSuspenseQuery({
    queryKey: adminDashboardMatchOverviewKeys.overview(),
    queryFn: async () => {
      const response = await getMatchOverview();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  return data;
};
