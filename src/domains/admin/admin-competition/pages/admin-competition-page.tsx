/**
 * 작성자: KYD
 * 기능: 대회 관리 페이지 - 대회 CRUD 기능
 * 프로세스 설명: 대회 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import AdminCompetition from "@admin/admin-competition/components/admin-competition";
import AdminCompetitionErrorFallback from "@admin/admin-competition/components/error/admin-competition-error-fallback";
import AdminCompetitionSkeleton from "@admin/admin-competition/components/skeleton/admin-competition-skeleton";

const AdminCompetitionPage = () => {
  return (
    <div className="bdks-admin-container">
      <ReactQueryBoundary skeleton={<AdminCompetitionSkeleton />} errorFallback={AdminCompetitionErrorFallback}>
        <AdminCompetition />
      </ReactQueryBoundary>
    </div>
  );
};

export default AdminCompetitionPage;
