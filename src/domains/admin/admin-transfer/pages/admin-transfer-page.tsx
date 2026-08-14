/**
 * 작성자: KYD
 * 기능: 관리자 이적 관리 페이지
 * 프로세스 설명: 이적 목록 표시 및 등록/수정/삭제
 */
import AdminTransfer from "@admin/admin-transfer/components/admin-transfer";
import AdminTransferErrorFallback from "@admin/admin-transfer/components/error/admin-transfer-error-fallback";
import AdminTransferSkeleton from "@admin/admin-transfer/components/skeleton/admin-transfer-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminTransferPage = () => {
  return (
    <AdminGridWrapper>
      <div className="col-start-1 col-end-9 row-start-1 row-end-9 h-full w-full">
        <ReactQueryBoundary skeleton={<AdminTransferSkeleton />} errorFallback={AdminTransferErrorFallback}>
          <AdminTransfer />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminTransferPage;
