/**
 * 작성자: KYD
 * 기능: 관리자 선수 관리 페이지
 * 프로세스 설명: 선수 목록 표시 및 선수 추가/수정/삭제 기능 (이미지 배경제거 도구는 헤더 버튼으로 전환)
 */
import AdminPlayer from "@admin/admin-player/components/admin-player";
import AdminPlayerErrorFallback from "@admin/admin-player/components/error/admin-player-error-fallback";
import AdminPlayerSkeleton from "@admin/admin-player/components/skeleton/admin-player-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

interface IAdminPlayerPageProps {
  initialView?: "players" | "transfers" | "retired";
}

const AdminPlayerPage = ({ initialView = "players" }: IAdminPlayerPageProps) => {
  return (
    <AdminGridWrapper>
      {/* 선수 목록 표 - 가로 전체, 세로 한 칸 빼고 */}
      <div className="h-full min-h-0 w-full xl:col-start-1 xl:col-end-9 xl:row-start-1 xl:row-end-9">
        <ReactQueryBoundary skeleton={<AdminPlayerSkeleton />} errorFallback={AdminPlayerErrorFallback}>
          <AdminPlayer key={initialView} initialView={initialView} />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminPlayerPage;
