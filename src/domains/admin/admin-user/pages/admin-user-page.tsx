/**
 * 작성자: KYD
 * 기능: 사용자 관리 페이지
 */
import AdminUser from "@admin/admin-user/components/admin-user";
import AdminUserErrorFallback from "@admin/admin-user/components/error/admin-user-error-fallback";
import AdminUserSkeleton from "@admin/admin-user/components/skeleton/admin-user-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminUserPage = () => {
  return (
    <AdminGridWrapper>
      <div className="col-start-1 col-end-9 row-start-1 row-end-8">
        <ReactQueryBoundary skeleton={<AdminUserSkeleton />} errorFallback={AdminUserErrorFallback}>
          <AdminUser />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminUserPage;
