/**
 * 작성자: KYD
 * 기능: 관리자 리그 관리 페이지
 * 프로세스 설명: 리그 목록 표시 및 리그 추가/수정/삭제 기능
 */
import AdminStandings from "@admin/admin-competition/admin-standings/components/admin-standings";
import AdminStandingsErrorFallback from "@admin/admin-competition/admin-standings/components/error/admin-standings-error-fallback";
import AdminStandingsSkeleton from "@admin/admin-competition/admin-standings/components/skeleton/admin-standings-skeleton";
import AdminCompetition from "@admin/admin-competition/components/admin-competition";
import AdminCompetitionErrorFallback from "@admin/admin-competition/components/error/admin-competition-error-fallback";
import AdminCompetitionSkeleton from "@admin/admin-competition/components/skeleton/admin-competition-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminCompetitionPage = () => {
  return (
    <AdminGridWrapper>
      {/* 상단: 대회 관리 */}
      <div className="h-full w-full md:col-start-1 md:col-end-9 md:row-start-1 md:row-end-4">
        <ReactQueryBoundary skeleton={<AdminCompetitionSkeleton />} errorFallback={AdminCompetitionErrorFallback}>
          <AdminCompetition />
        </ReactQueryBoundary>
      </div>
      {/* 하단: 리그 순위 */}
      <div className="h-full w-full md:col-start-1 md:col-end-9 md:row-start-4 md:row-end-9">
        <ReactQueryBoundary skeleton={<AdminStandingsSkeleton />} errorFallback={AdminStandingsErrorFallback}>
          <AdminStandings />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminCompetitionPage;
