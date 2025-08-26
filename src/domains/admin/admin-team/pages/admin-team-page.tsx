/**
 * 작성자: KYD
 * 기능: 팀 관리 페이지 - 팀 CRUD 기능
 * 프로세스 설명: 팀 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import AdminTeam from "@admin/admin-team/components/admin-team";
import AdminTeamErrorFallback from "@admin/admin-team/components/error/admin-team-error-fallback";
import AdminTeamSkeleton from "@admin/admin-team/components/skeleton/admin-team-skeleton";

const AdminTeamPage = () => {
  return (
    <div className="bdks-admin-container">
      <ReactQueryBoundary skeleton={<AdminTeamSkeleton />} errorFallback={AdminTeamErrorFallback}>
        <AdminTeam />
      </ReactQueryBoundary>
    </div>
  );
};

export default AdminTeamPage;
