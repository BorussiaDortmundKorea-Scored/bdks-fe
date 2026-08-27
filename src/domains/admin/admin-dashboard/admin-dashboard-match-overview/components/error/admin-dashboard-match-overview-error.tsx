/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 카드 에러 폴백
 */
import AdminDashboardMatchOverviewWrapper from "../wrapper/admin-dashboard-match-overview-wrapper";

const AdminDashboardMatchOverviewError = () => {
  return (
    <AdminDashboardMatchOverviewWrapper>
      <div data-testid="admin-dashboard-match-overview-error" className="text-yds-c1m text-primary-100">
        경기 평점 현황을 불러오지 못했습니다.
      </div>
    </AdminDashboardMatchOverviewWrapper>
  );
};

export default AdminDashboardMatchOverviewError;
