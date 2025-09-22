/**
 * 작성자: KYD
 * 기능: 경기 관리 페이지 - 경기 CRUD 기능
 * 프로세스 설명: 경기 목록 조회, 생성, 수정, 삭제 기능 제공 및 라인업 관리 접근
 */
import AdminMatch from "@admin/admin-match/components/admin-match";
import AdminMatchErrorFallback from "@admin/admin-match/components/error/admin-match-error";
import AdminMatchSkeleton from "@admin/admin-match/components/skeleton/admin-match-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminMatchPage = () => {
  return (
    <div className="bdks-admin-container">
      <ReactQueryBoundary skeleton={<AdminMatchSkeleton />} errorFallback={AdminMatchErrorFallback}>
        <AdminMatch />
      </ReactQueryBoundary>
    </div>
  );
};

export default AdminMatchPage;
