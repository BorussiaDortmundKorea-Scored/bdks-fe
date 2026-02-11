import AdminDashboardUserLoginTypeWrapper from "../wrapper/admin-dashboard-user-login-type-wrapper";

const AdminDashboardUserLoginTypeError = () => {
  return (
    <AdminDashboardUserLoginTypeWrapper>
      <div data-testid="admin-dashboard-user-login-type-error">에러발생</div>
    </AdminDashboardUserLoginTypeWrapper>
  );
};

export default AdminDashboardUserLoginTypeError;
