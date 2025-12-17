/**
 * 작성자: KYD
 * 기능: 관리자 리그 관리 페이지
 * 프로세스 설명: 리그 목록 표시 및 리그 추가/수정/삭제 기능
 */
import AdminCompetition from "@admin/admin-competition/components/admin-competition";
import AdminCompetitionErrorFallback from "@admin/admin-competition/components/error/admin-competition-error-fallback";
import AdminCompetitionSkeleton from "@admin/admin-competition/components/skeleton/admin-competition-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminCompetitionPage = () => {
  return (
    <AdminGridWrapper>
      {/* 리그 목록 표 - 가로 전체, 세로 한 칸 빼고 */}
      <div className="col-start-1 col-end-9 row-start-1 row-end-9 h-full w-full">
        <ReactQueryBoundary skeleton={<AdminCompetitionSkeleton />} errorFallback={AdminCompetitionErrorFallback}>
          <AdminCompetition />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminCompetitionPage;
