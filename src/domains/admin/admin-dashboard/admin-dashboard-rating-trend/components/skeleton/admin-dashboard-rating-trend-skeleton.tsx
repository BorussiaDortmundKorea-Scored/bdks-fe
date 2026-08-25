/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 스켈레톤 UI (PagedCard 단일 카드 레이아웃)
 */
import AdminDashboardRatingTrendWrapper from "../wrapper/admin-dashboard-rating-trend-wrapper";

const AdminDashboardRatingTrendSkeleton = () => {
  return (
    <AdminDashboardRatingTrendWrapper>
      <div data-testid="admin-dashboard-rating-trend-skeleton" className="flex w-full animate-pulse flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="bg-background-secondary h-5 w-1/3 rounded" />
          <div className="flex gap-2">
            <div className="bg-background-secondary h-3.5 w-3.5 rounded-full" />
            <div className="bg-background-secondary h-3.5 w-3.5 rounded-full" />
          </div>
        </div>
        <div className="bg-background-secondary h-6 w-1/2 rounded" />
        <div className="bg-background-secondary h-[72px] w-full rounded" />
      </div>
    </AdminDashboardRatingTrendWrapper>
  );
};

export default AdminDashboardRatingTrendSkeleton;
