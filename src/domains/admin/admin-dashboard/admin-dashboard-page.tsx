/**
 * 작성자: KYD
 * 기능: 관리자 페이지 - 각 관리 메뉴로 이동
 * 프로세스 설명: 관리 메뉴 항목들을 배열로 관리하고 클릭 시 해당 페이지로 이동
 */
import AdminDashboardDeletedUsers from "./admin-dashboard-deleted-users/components/admin-dashboard-deleted-users";
import AdminDashboardDeletedUsersError from "./admin-dashboard-deleted-users/components/error/admin-dashboard-deleted-users-error";
import AdminDashboardDeletedUsersSkeleton from "./admin-dashboard-deleted-users/components/skeleton/admin-dashboard-deleted-users-skeleton";
import AdminDashboardMatchOverview from "./admin-dashboard-match-overview/components/admin-dashboard-match-overview";
import AdminDashboardMatchOverviewError from "./admin-dashboard-match-overview/components/error/admin-dashboard-match-overview-error";
import AdminDashboardMatchOverviewSkeleton from "./admin-dashboard-match-overview/components/skeleton/admin-dashboard-match-overview-skeleton";
import AdminDashboardRatingTrend from "./admin-dashboard-rating-trend/components/admin-dashboard-rating-trend";
import AdminDashboardRatingTrendError from "./admin-dashboard-rating-trend/components/error/admin-dashboard-rating-trend-error";
import AdminDashboardRatingTrendSkeleton from "./admin-dashboard-rating-trend/components/skeleton/admin-dashboard-rating-trend-skeleton";
import AdminDashboardSites from "./admin-dashboard-sites/components/admin-dashboard-sites";
import AdminDashboardUserCountError from "./admin-dashboard-user-count/components/error/admin-dashboard-user-count-error";
import AdminDashboardUserCountSkeleton from "./admin-dashboard-user-count/components/skeleton/admin-dashboard-user-count-skeleton";
import AdminDashboardUserLoginTypeError from "./admin-dashboard-user-login-type/components/error/admin-dashboard-user-login-type-error";
import AdminDashboardUserLoginTypeSkeleton from "./admin-dashboard-user-login-type/components/skeleton/admin-dashboard-user-login-type-skeleton";

import AdminDashboardUserCount from "@admin/admin-dashboard/admin-dashboard-user-count/components/admin-dashboard-user-count";
import AdminDashboardUserLoginType from "@admin/admin-dashboard/admin-dashboard-user-login-type/components/admin-dashboard-user-login-type";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminDashboardPage = () => {
  return (
    <AdminGridWrapper>
      <AdminDashboardSites />
      <ReactQueryBoundary skeleton={<AdminDashboardUserCountSkeleton />} errorFallback={AdminDashboardUserCountError}>
        <AdminDashboardUserCount />
      </ReactQueryBoundary>
      <ReactQueryBoundary
        skeleton={<AdminDashboardDeletedUsersSkeleton />}
        errorFallback={AdminDashboardDeletedUsersError}
      >
        <AdminDashboardDeletedUsers />
      </ReactQueryBoundary>
      <ReactQueryBoundary
        skeleton={<AdminDashboardUserLoginTypeSkeleton />}
        errorFallback={AdminDashboardUserLoginTypeError}
      >
        <AdminDashboardUserLoginType />
      </ReactQueryBoundary>
      <ReactQueryBoundary
        skeleton={<AdminDashboardRatingTrendSkeleton />}
        errorFallback={AdminDashboardRatingTrendError}
      >
        <AdminDashboardRatingTrend />
      </ReactQueryBoundary>
      <ReactQueryBoundary
        skeleton={<AdminDashboardMatchOverviewSkeleton />}
        errorFallback={AdminDashboardMatchOverviewError}
      >
        <AdminDashboardMatchOverview />
      </ReactQueryBoundary>
    </AdminGridWrapper>
  );
};

export default AdminDashboardPage;
