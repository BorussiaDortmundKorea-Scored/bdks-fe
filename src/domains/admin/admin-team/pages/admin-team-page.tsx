/**
 * 작성자: KYD
 * 기능: 관리자 팀 관리 페이지
 * 프로세스 설명: 팀 목록 표시 및 팀 추가/수정/삭제 기능
 */
import AdminTeam from "@admin/admin-team/components/admin-team";
import AdminTeamErrorFallback from "@admin/admin-team/components/error/admin-team-error-fallback";
import AdminTeamSkeleton from "@admin/admin-team/components/skeleton/admin-team-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminTeamPage = () => {
  return (
    <AdminGridWrapper>
      {/* 팀 목록 표 - 가로 전체, 세로 한 칸 빼고 */}
      <div className="card-navy-50 col-start-1 col-end-9 row-start-1 row-end-8 h-full w-full">
        <ReactQueryBoundary skeleton={<AdminTeamSkeleton />} errorFallback={AdminTeamErrorFallback}>
          <AdminTeam />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminTeamPage;
