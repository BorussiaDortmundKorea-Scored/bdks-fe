/**
 * 작성자: KYD
 * 기능: 라인업 관리 페이지 - 라인업 CRUD 기능
 * 프로세스 설명: 특정 경기의 라인업 목록 조회, 생성, 수정, 삭제 기능 제공
 */
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import AdminMatchLineup from "@admin/admin-match/admin-match-lineup/components/admin-match-lineup";
import AdminMatchLineupErrorFallback from "@admin/admin-match/admin-match-lineup/components/error/admin-match-lineup-error-fallback";
import AdminMatchLineupSkeleton from "@admin/admin-match/admin-match-lineup/components/skeleton/admin-match-lineup-skeleton";

const AdminMatchLineupPage = () => {
  return (
    <div className="bdks-admin-container">
      <ReactQueryBoundary skeleton={<AdminMatchLineupSkeleton />} errorFallback={AdminMatchLineupErrorFallback}>
        <AdminMatchLineup />
      </ReactQueryBoundary>
    </div>
  );
};

export default AdminMatchLineupPage;
