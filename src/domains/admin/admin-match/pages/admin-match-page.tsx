/**
 * 작성자: KYD
 * 기능: 관리자 경기 관리 페이지
 * 프로세스 설명: 경기 목록 표시 및 경기 추가/수정/삭제 기능
 */
import AdminMatch from "@admin/admin-match/components/admin-match";
import AdminMatchError from "@admin/admin-match/components/error/admin-match-error";
import AdminMatchSkeleton from "@admin/admin-match/components/skeleton/admin-match-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminMatchPage = () => {
  return (
    <AdminGridWrapper>
      {/* 경기 목록 표 - 가로 전체, 세로 한 칸 빼고 */}
      <div className="col-start-1 col-end-9 row-start-1 row-end-9 h-full w-full">
        <ReactQueryBoundary skeleton={<AdminMatchSkeleton />} errorFallback={AdminMatchError}>
          <AdminMatch />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminMatchPage;
