/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 조회 React Query 키
 */
export const adminDashboardMatchOverviewKeys = {
  all: ["admin-dashboard-match-overview"] as const,
  overview: () => [...adminDashboardMatchOverviewKeys.all, "overview"] as const,
};
