/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 에러 폴백 UI
 */
import AdminDashboardRatingTrendWrapper from "../wrapper/admin-dashboard-rating-trend-wrapper";

const AdminDashboardRatingTrendError = () => {
  return (
    <AdminDashboardRatingTrendWrapper>
      <div
        data-testid="admin-dashboard-rating-trend-error"
        className="flex h-full w-full flex-col items-center justify-center gap-2"
      >
        <p className="text-lg font-semibold text-red-500">데이터를 불러올 수 없습니다</p>
        <p className="text-primary-100 text-sm">잠시 후 다시 시도해주세요</p>
      </div>
    </AdminDashboardRatingTrendWrapper>
  );
};

export default AdminDashboardRatingTrendError;
