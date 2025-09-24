/**
 * 작성자: KYD
 * 기능: 관리자 페이지 - 각 관리 메뉴로 이동
 * 프로세스 설명: 관리 메뉴 항목들을 배열로 관리하고 클릭 시 해당 페이지로 이동
 */
import AdminDashboardUserCountError from "./admin-dashboard-user-count/components/error/admin-dashboard-user-count-error";
import AdminDashboardUserCountSkeleton from "./admin-dashboard-user-count/components/skeleton/admin-dashboard-user-count-skeleton";

import AdminDashboardUserCount from "@admin/admin-dashboard/admin-dashboard-user-count/components/admin-dashboard-user-count";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminDashboardPage = () => {
  return (
    <AdminGridWrapper>
      <div className="card-navy-50 col-start-1 col-end-9 row-start-1 row-end-2 h-full w-full">1</div>
      <ReactQueryBoundary skeleton={<AdminDashboardUserCountSkeleton />} errorFallback={AdminDashboardUserCountError}>
        <AdminDashboardUserCount />
      </ReactQueryBoundary>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
      <div>1</div>
    </AdminGridWrapper>
  );
};

export default AdminDashboardPage;
