/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 조회 React Query 훅
 */
import { getMatchStatsData } from "../admin-dashboard-match-stats-api";
import { adminDashboardMatchStatsKeys } from "./admin-dashboard-match-stats-query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetMatchStats = () => {
  const { data } = useSuspenseQuery({
    queryKey: adminDashboardMatchStatsKeys.stats(),
    queryFn: getMatchStatsData,
    staleTime: 1000 * 60 * 5, // 5분
  });

  return data;
};
