/**
 * 작성자: KYD
 * 기능: 경기별 평점 참여율(커버리지) 카드
 * 프로세스 설명: get_match_participation_coverage RPC로 경기별 유니크 참여자 수와 전체 회원 대비 참여율(%)을 가로 스크롤 카드로 표시
 */
import { HorizonDragScroll } from "@youngduck/yd-ui/HorizonDragScroll";

import { useGetMatchCoverageSuspense } from "../api/react-query-api/use-get-match-coverage";
import AdminDashboardMatchCoverageWrapper from "./wrapper/admin-dashboard-match-coverage-wrapper";

const AdminDashboardMatchCoverage = () => {
  //SECTION HOOK호출 영역
  const { data: matchCoverage } = useGetMatchCoverageSuspense();
  //!SECTION HOOK호출 영역

  return (
    <AdminDashboardMatchCoverageWrapper>
      <h2 className="text-yds-s2">경기별 평점 참여율</h2>
      {matchCoverage.length === 0 ? (
        <p className="text-yds-c1m text-primary-100">평점 데이터가 있는 경기가 없습니다.</p>
      ) : (
        <HorizonDragScroll className="w-full items-stretch gap-3">
          {matchCoverage.map((match) => (
            <div
              key={match.match_id}
              className="bg-background-secondary card-navy-50 flex w-[150px] shrink-0 flex-col justify-between gap-2 rounded-md p-3"
            >
              <div className="flex flex-col">
                <span className="text-yds-b2 truncate text-white">{match.opponent_name}</span>
                <span className="text-yds-c1m text-primary-100">{match.match_date}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-yds-b2 text-primary-400">{match.coverage_percent}%</span>
                  <span className="text-yds-c1m text-primary-100">
                    {match.participant_count}/{match.total_users}명
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="bg-primary-400 h-full rounded-full"
                    style={{ width: `${Math.min(Number(match.coverage_percent), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </HorizonDragScroll>
      )}
    </AdminDashboardMatchCoverageWrapper>
  );
};

export default AdminDashboardMatchCoverage;
