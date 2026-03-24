/**
 * 작성자: KYD
 * 기능: 탈퇴 회원 통계 에러 폴백
 */
import AdminDashboardDeletedUsersWrapper from "../wrapper/admin-dashboard-deleted-users-wrapper";

const AdminDashboardDeletedUsersError = () => {
  return (
    <AdminDashboardDeletedUsersWrapper>
      <div data-testid="admin-dashboard-deleted-users-error">에러발생</div>
    </AdminDashboardDeletedUsersWrapper>
  );
};

export default AdminDashboardDeletedUsersError;
