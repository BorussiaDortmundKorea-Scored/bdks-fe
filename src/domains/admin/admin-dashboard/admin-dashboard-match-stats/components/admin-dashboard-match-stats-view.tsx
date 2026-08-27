/**
 * 작성자: KYD
 * 기능: 평점 입력 현황(갯수) 뷰 - 막대 차트 + 경기별 드릴다운
 * 프로세스 설명: 데이터를 prop 으로 받아, 막대(경기) 클릭 시 해당 경기의 유저별 평점 입력 횟수
 *              세부 차트로 전환되고 뒤로가기로 복귀한다. (단독 카드 / 통합 PagedCard 양쪽에서 재사용)
 */
import { useState } from "react";

import { type IMatchStatsData } from "../api/admin-dashboard-match-stats-api";
import AdminDashboardMatchStatsChart, { type ISelectedMatch } from "./admin-dashboard-match-stats-chart";
import AdminDashboardMatchStatsDetailChart from "./admin-dashboard-match-stats-detail-chart";
import AdminDashboardMatchStatsDetailError from "./error/admin-dashboard-match-stats-detail-error";
import AdminDashboardMatchStatsDetailSkeleton from "./skeleton/admin-dashboard-match-stats-detail-skeleton";
import { ArrowLeft } from "lucide-react";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

interface IAdminDashboardMatchStatsView {
  data: IMatchStatsData[];
  /** 요약(막대) 화면 상단 제목. 미지정 시 제목 없이 차트만 렌더(상위 헤더가 제목을 담당하는 경우) */
  title?: string;
}

const AdminDashboardMatchStatsView = ({ data, title }: IAdminDashboardMatchStatsView) => {
  //SECTION 상태값 영역
  const [selectedMatch, setSelectedMatch] = useState<ISelectedMatch | null>(null);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleBack = () => setSelectedMatch(null);
  //!SECTION 메서드 영역

  if (selectedMatch) {
    return (
      <div className="flex h-full flex-col">
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleBack}
            aria-label="뒤로 가기"
            className="text-primary-100 hover:text-primary-400 flex shrink-0 cursor-pointer items-center gap-1"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-yds-s2 truncate">유저별 평점 입력 횟수 · {selectedMatch.match_name}</h2>
        </div>
        <div className="min-h-0 flex-1">
          <ReactQueryBoundary
            skeleton={<AdminDashboardMatchStatsDetailSkeleton />}
            errorFallback={AdminDashboardMatchStatsDetailError}
          >
            <AdminDashboardMatchStatsDetailChart matchId={selectedMatch.match_id} />
          </ReactQueryBoundary>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {title ? <h2 className="text-yds-s2 mb-2">{title}</h2> : null}
      <div className="min-h-0 flex-1">
        <AdminDashboardMatchStatsChart data={data} onBarClick={setSelectedMatch} />
      </div>
    </div>
  );
};

export default AdminDashboardMatchStatsView;
