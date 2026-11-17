/**
 * 작성자: KYD
 * 기능: 경기 라인업 관리 페이지
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import AdminMatchLineup from "@admin/admin-match/admin-match-lineup/components/admin-match-lineup";
import AdminMatchLineupErrorFallback from "@admin/admin-match/admin-match-lineup/components/error/admin-match-lineup-error-fallback";
import AdminMatchLineupSkeleton from "@admin/admin-match/admin-match-lineup/components/skeleton/admin-match-lineup-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminMatchLineupPage = () => {
  return (
    <AdminGridWrapper>
      {/* 라인업 목록 표 - 가로 전체, 세로 한 칸 빼고 */}
      <div className="h-full min-h-0 w-full xl:col-start-1 xl:col-end-9 xl:row-start-1 xl:row-end-9">
        <ReactQueryBoundary skeleton={<AdminMatchLineupSkeleton />} errorFallback={AdminMatchLineupErrorFallback}>
          <AdminMatchLineup />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminMatchLineupPage;
