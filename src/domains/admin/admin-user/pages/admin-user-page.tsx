/**
 * 작성자: KYD
 * 기능: 사용자 관리 페이지
 * 프로세스 설명: 상단은 사용자 목록 테이블, 하단 1행은 인기 최애선수 순위(가로 스크롤)
 */
import AdminUserPopularPlayers from "@admin/admin-user/admin-user-popular-players/components/admin-user-popular-players";
import AdminUserPopularPlayersErrorFallback from "@admin/admin-user/admin-user-popular-players/components/error/admin-user-popular-players-error-fallback";
import AdminUserPopularPlayersSkeleton from "@admin/admin-user/admin-user-popular-players/components/skeleton/admin-user-popular-players-skeleton";
import AdminUser from "@admin/admin-user/components/admin-user";
import AdminUserErrorFallback from "@admin/admin-user/components/error/admin-user-error-fallback";
import AdminUserSkeleton from "@admin/admin-user/components/skeleton/admin-user-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminUserPage = () => {
  return (
    <AdminGridWrapper>
      {/* 상단: 사용자 목록 */}
      <div className="h-full w-full md:col-start-1 md:col-end-9 md:row-start-1 md:row-end-7">
        <ReactQueryBoundary skeleton={<AdminUserSkeleton />} errorFallback={AdminUserErrorFallback}>
          <AdminUser />
        </ReactQueryBoundary>
      </div>
      {/* 하단 1행: 인기 최애선수 순위 */}
      <div className="h-full w-full md:col-start-1 md:col-end-9 md:row-start-7 md:row-end-9">
        <ReactQueryBoundary
          skeleton={<AdminUserPopularPlayersSkeleton />}
          errorFallback={AdminUserPopularPlayersErrorFallback}
        >
          <AdminUserPopularPlayers />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminUserPage;
