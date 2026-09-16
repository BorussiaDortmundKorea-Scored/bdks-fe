/**
 * 작성자: KYD
 * 기능: 평점 분포 카드 에러 폴백
 */
import AdminDashboardRatingDistributionWrapper from "../wrapper/admin-dashboard-rating-distribution-wrapper";

const AdminDashboardRatingDistributionError = () => {
  return (
    <AdminDashboardRatingDistributionWrapper>
      <div data-testid="admin-dashboard-rating-distribution-error" className="text-yds-c1m text-primary-100">
        평점 분포를 불러오지 못했습니다.
      </div>
    </AdminDashboardRatingDistributionWrapper>
  );
};

export default AdminDashboardRatingDistributionError;
