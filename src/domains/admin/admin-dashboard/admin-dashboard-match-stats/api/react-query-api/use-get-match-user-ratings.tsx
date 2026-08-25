/**
 * 작성자: KYD
 * 기능: 경기별 유저 평점 입력 횟수 조회 React Query 훅
 */
import { getMatchUserRatingCounts } from "../admin-dashboard-match-user-ratings-api";
import { adminDashboardMatchStatsKeys } from "./admin-dashboard-match-stats-query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useGetMatchUserRatings = (matchId: string) => {
  const { data } = useSuspenseQuery({
    queryKey: adminDashboardMatchStatsKeys.userRatings(matchId),
    queryFn: async () => {
      const response = await getMatchUserRatingCounts(matchId);
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  return data;
};
