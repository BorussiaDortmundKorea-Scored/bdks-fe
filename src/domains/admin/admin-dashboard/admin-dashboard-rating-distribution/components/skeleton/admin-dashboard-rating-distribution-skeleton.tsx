/**
 * 작성자: KYD
 * 기능: 평점 분포 카드 스켈레톤
 */
import AdminDashboardRatingDistributionWrapper from "../wrapper/admin-dashboard-rating-distribution-wrapper";

const AdminDashboardRatingDistributionSkeleton = () => {
  return (
    <AdminDashboardRatingDistributionWrapper>
      {/* 본체 PagedCard(헤더 + 소제목 + 104px 차트)와 같은 높이를 잡아 로딩 중 레이아웃이 튀지 않게 한다 */}
      <div data-testid="admin-dashboard-rating-distribution-skeleton" className="h-[150px] w-full">
        <div className="h-full w-full animate-pulse rounded-md bg-white/5" />
      </div>
    </AdminDashboardRatingDistributionWrapper>
  );
};

export default AdminDashboardRatingDistributionSkeleton;
