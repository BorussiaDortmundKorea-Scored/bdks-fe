/**
 * 작성자: KYD
 * 기능: 선수 관리 페이지
 * 프로세스 설명: ReactQueryBoundary로 감싸서 스켈레톤과 에러 처리를 담당
 */
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import AdminPlayer from "@admin/admin-player/components/admin-player";
import AdminPlayerErrorFallback from "@admin/admin-player/components/error/admin-player-error-fallback";
import AdminPlayerSkeleton from "@admin/admin-player/components/skeleton/admin-player-skeleton";

const AdminPlayerPage = () => {
  return (
    <div className="bdks-admin-container">
      <ReactQueryBoundary skeleton={<AdminPlayerSkeleton />} errorFallback={AdminPlayerErrorFallback}>
        <AdminPlayer />
      </ReactQueryBoundary>
    </div>
  );
};

export default AdminPlayerPage;
