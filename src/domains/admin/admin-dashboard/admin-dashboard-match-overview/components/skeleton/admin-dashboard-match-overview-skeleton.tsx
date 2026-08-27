/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 카드 스켈레톤
 */
import AdminDashboardMatchOverviewWrapper from "../wrapper/admin-dashboard-match-overview-wrapper";

const AdminDashboardMatchOverviewSkeleton = () => {
  return (
    <AdminDashboardMatchOverviewWrapper>
      <div data-testid="admin-dashboard-match-overview-skeleton" className="h-[240px] w-full">
        <div className="h-full w-full animate-pulse rounded-md bg-white/5" />
      </div>
    </AdminDashboardMatchOverviewWrapper>
  );
};

export default AdminDashboardMatchOverviewSkeleton;
