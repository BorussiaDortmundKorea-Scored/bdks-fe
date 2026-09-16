/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 에러 폴백
 */
import AdminDashboardRetentionWrapper from "../wrapper/admin-dashboard-retention-wrapper";

const AdminDashboardRetentionError = () => {
  return (
    <AdminDashboardRetentionWrapper>
      <div data-testid="admin-dashboard-retention-error" className="text-yds-c1m text-primary-100">
        리텐션 정보를 불러오지 못했습니다.
      </div>
    </AdminDashboardRetentionWrapper>
  );
};

export default AdminDashboardRetentionError;
