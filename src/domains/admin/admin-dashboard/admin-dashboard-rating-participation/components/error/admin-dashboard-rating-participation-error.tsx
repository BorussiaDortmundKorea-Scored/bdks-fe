/**
 * 작성자: KYD
 * 기능: 평점 참여율 카드 에러 폴백
 */
import AdminDashboardRatingParticipationWrapper from "../wrapper/admin-dashboard-rating-participation-wrapper";

const AdminDashboardRatingParticipationError = () => {
  return (
    <AdminDashboardRatingParticipationWrapper>
      <div data-testid="admin-dashboard-rating-participation-error">에러발생</div>
    </AdminDashboardRatingParticipationWrapper>
  );
};

export default AdminDashboardRatingParticipationError;
