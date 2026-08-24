/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 메인 컴포넌트
 * 프로세스 설명: 요약(경기별 평점 입력 현황) 차트에서 막대를 클릭하면 해당 경기의
 *              유저별 평점 입력 횟수 세부 차트로 전환되며, 뒤로가기 버튼으로 복귀한다.
 */
import { useState } from "react";

import { ArrowLeft } from "lucide-react";

import AdminDashboardMatchStatsChart, { type ISelectedMatch } from "./admin-dashboard-match-stats-chart";
import AdminDashboardMatchStatsDetailChart from "./admin-dashboard-match-stats-detail-chart";
import AdminDashboardMatchStatsDetailError from "./error/admin-dashboard-match-stats-detail-error";
import AdminDashboardMatchStatsDetailSkeleton from "./skeleton/admin-dashboard-match-stats-detail-skeleton";
import AdminDashboardMatchStatsWrapper from "./wrapper/admin-dashboard-match-stats-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const AdminDashboardMatchStats = () => {
  //SECTION 상태값 영역
  const [selectedMatch, setSelectedMatch] = useState<ISelectedMatch | null>(null);
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleBack = () => setSelectedMatch(null);
  //!SECTION 메서드 영역

  return (
    <AdminDashboardMatchStatsWrapper>
      {selectedMatch ? (
        <>
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
          <ReactQueryBoundary
            skeleton={<AdminDashboardMatchStatsDetailSkeleton />}
            errorFallback={AdminDashboardMatchStatsDetailError}
          >
            <AdminDashboardMatchStatsDetailChart matchId={selectedMatch.match_id} />
          </ReactQueryBoundary>
        </>
      ) : (
        <>
          <h2 className="text-yds-s2">평점 입력 현황</h2>
          <AdminDashboardMatchStatsChart onBarClick={setSelectedMatch} />
        </>
      )}
    </AdminDashboardMatchStatsWrapper>
  );
};

export default AdminDashboardMatchStats;
