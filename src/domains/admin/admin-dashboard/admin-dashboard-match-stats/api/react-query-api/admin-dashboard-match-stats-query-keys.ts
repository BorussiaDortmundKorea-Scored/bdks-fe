/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 React Query 키
 */
export const adminDashboardMatchStatsKeys = {
  all: ["admin-dashboard-match-stats"] as const,
  stats: () => [...adminDashboardMatchStatsKeys.all, "stats"] as const,
};
