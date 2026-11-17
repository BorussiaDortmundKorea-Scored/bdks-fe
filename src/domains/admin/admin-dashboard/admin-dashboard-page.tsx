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
import AdminDashboardRatingDistribution from "./admin-dashboard-rating-distribution/components/admin-dashboard-rating-distribution";
import AdminDashboardRatingDistributionError from "./admin-dashboard-rating-distribution/components/error/admin-dashboard-rating-distribution-error";
import AdminDashboardRatingDistributionSkeleton from "./admin-dashboard-rating-distribution/components/skeleton/admin-dashboard-rating-distribution-skeleton";
import AdminDashboardRatingTrend from "./admin-dashboard-rating-trend/components/admin-dashboard-rating-trend";
import AdminDashboardRatingTrendError from "./admin-dashboard-rating-trend/components/error/admin-dashboard-rating-trend-error";
import AdminDashboardRatingTrendSkeleton from "./admin-dashboard-rating-trend/components/skeleton/admin-dashboard-rating-trend-skeleton";
import AdminDashboardRetention from "./admin-dashboard-retention/components/admin-dashboard-retention";
import AdminDashboardRetentionError from "./admin-dashboard-retention/components/error/admin-dashboard-retention-error";
import AdminDashboardRetentionSkeleton from "./admin-dashboard-retention/components/skeleton/admin-dashboard-retention-skeleton";
import AdminDashboardSites from "./admin-dashboard-sites/components/admin-dashboard-sites";
import AdminDashboardUserCountError from "./admin-dashboard-user-count/components/error/admin-dashboard-user-count-error";
import AdminDashboardUserCountSkeleton from "./admin-dashboard-user-count/components/skeleton/admin-dashboard-user-count-skeleton";
import AdminDashboardUserLoginTypeError from "./admin-dashboard-user-login-type/components/error/admin-dashboard-user-login-type-error";
import AdminDashboardUserLoginTypeSkeleton from "./admin-dashboard-user-login-type/components/skeleton/admin-dashboard-user-login-type-skeleton";

import AdminDashboardUserCount from "@admin/admin-dashboard/admin-dashboard-user-count/components/admin-dashboard-user-count";
import AdminDashboardUserLoginType from "@admin/admin-dashboard/admin-dashboard-user-login-type/components/admin-dashboard-user-login-type";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

/**
 * 8x8 그리드 칸 배치 — 위젯은 자기 위치를 모르고, 칸을 꽉 채우기만 한다.
 * 칸 순서(DOM 순서)는 모바일 세로 쌓기 순서이기도 하다.
 *
 *   행\열  1   2   3   4   5   6   7   8
 *   1     [회원수 ][탈퇴   ][사이트          ]
 *   2-3   [회원 유형  ][평점 활동 추이        ]
 *   4-6   [경기 평점 현황            ]
 *   7-8   [회원 리텐션    ][평점 분포        ]
 */
const CELL = "min-h-0 min-w-0";
const AREA = {
  sites: `${CELL} xl:col-start-5 xl:col-end-9 xl:row-start-1 xl:row-end-2`,
  userCount: `${CELL} xl:col-start-1 xl:col-end-3 xl:row-start-1 xl:row-end-2`,
  deletedUsers: `${CELL} xl:col-start-3 xl:col-end-5 xl:row-start-1 xl:row-end-2`,
  userLoginType: `${CELL} xl:col-start-1 xl:col-end-4 xl:row-start-2 xl:row-end-4`,
  ratingTrend: `${CELL} xl:col-start-4 xl:col-end-9 xl:row-start-2 xl:row-end-4`,
  matchOverview: `${CELL} xl:col-start-1 xl:col-end-7 xl:row-start-4 xl:row-end-7`,
  retention: `${CELL} xl:col-start-1 xl:col-end-5 xl:row-start-7 xl:row-end-9`,
  ratingDistribution: `${CELL} xl:col-start-5 xl:col-end-9 xl:row-start-7 xl:row-end-9`,
};

const AdminDashboardPage = () => {
  return (
    <AdminGridWrapper>
      <div className={AREA.sites}>
        <AdminDashboardSites />
      </div>
      <div className={AREA.userCount}>
        <ReactQueryBoundary skeleton={<AdminDashboardUserCountSkeleton />} errorFallback={AdminDashboardUserCountError}>
          <AdminDashboardUserCount />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.deletedUsers}>
        <ReactQueryBoundary
          skeleton={<AdminDashboardDeletedUsersSkeleton />}
          errorFallback={AdminDashboardDeletedUsersError}
        >
          <AdminDashboardDeletedUsers />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.userLoginType}>
        <ReactQueryBoundary
          skeleton={<AdminDashboardUserLoginTypeSkeleton />}
          errorFallback={AdminDashboardUserLoginTypeError}
        >
          <AdminDashboardUserLoginType />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.ratingTrend}>
        <ReactQueryBoundary
          skeleton={<AdminDashboardRatingTrendSkeleton />}
          errorFallback={AdminDashboardRatingTrendError}
        >
          <AdminDashboardRatingTrend />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.matchOverview}>
        <ReactQueryBoundary
          skeleton={<AdminDashboardMatchOverviewSkeleton />}
          errorFallback={AdminDashboardMatchOverviewError}
        >
          <AdminDashboardMatchOverview />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.retention}>
        <ReactQueryBoundary skeleton={<AdminDashboardRetentionSkeleton />} errorFallback={AdminDashboardRetentionError}>
          <AdminDashboardRetention />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.ratingDistribution}>
        <ReactQueryBoundary
          skeleton={<AdminDashboardRatingDistributionSkeleton />}
          errorFallback={AdminDashboardRatingDistributionError}
        >
          <AdminDashboardRatingDistribution />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminDashboardPage;
