/**
 * 작성자: KYD
 * 기능: 관리자 국가 관리 페이지
 * 프로세스 설명: 국가 목록 표시 및 국가 추가/수정/삭제 기능
 */
import AdminCountry from "@admin/admin-country/components/admin-country";
import AdminCountryErrorFallback from "@admin/admin-country/components/error/admin-country-error-fallback";
import AdminCountrySkeleton from "@admin/admin-country/components/skeleton/admin-country-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminCountryPage = () => {
  return (
    <AdminGridWrapper>
      {/* 국가 목록 표 - 가로 전체, 세로 한 칸 빼고 */}
      <div className="col-start-1 col-end-9 row-start-1 row-end-9 h-full w-full">
        <ReactQueryBoundary skeleton={<AdminCountrySkeleton />} errorFallback={AdminCountryErrorFallback}>
          <AdminCountry />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminCountryPage;
