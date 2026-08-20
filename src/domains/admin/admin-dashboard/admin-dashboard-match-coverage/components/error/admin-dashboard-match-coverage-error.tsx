/**
 * 작성자: KYD
 * 기능: 경기별 평점 참여율 카드 에러 폴백
 */
import AdminDashboardMatchCoverageWrapper from "../wrapper/admin-dashboard-match-coverage-wrapper";

const AdminDashboardMatchCoverageError = () => {
  return (
    <AdminDashboardMatchCoverageWrapper>
      <div data-testid="admin-dashboard-match-coverage-error">에러발생</div>
    </AdminDashboardMatchCoverageWrapper>
  );
};

export default AdminDashboardMatchCoverageError;
