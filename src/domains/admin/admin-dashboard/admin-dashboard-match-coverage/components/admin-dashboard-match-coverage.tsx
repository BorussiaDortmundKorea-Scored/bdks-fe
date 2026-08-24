/**
 * 작성자: KYD
 * 기능: 경기별 평점 참여율(커버리지) 추이 카드
 * 프로세스 설명: get_match_participation_coverage RPC로 경기별 참여율(%)을 Line 추이 차트로 표시하고, hover 시 상세(경기명/날짜/참여명수/참여율)를 툴팁으로 노출
 */
import { useGetMatchCoverageSuspense } from "../api/react-query-api/use-get-match-coverage";
import AdminDashboardMatchCoverageChart from "./admin-dashboard-match-coverage-chart";
import AdminDashboardMatchCoverageWrapper from "./wrapper/admin-dashboard-match-coverage-wrapper";

const AdminDashboardMatchCoverage = () => {
  //SECTION HOOK호출 영역
  const { data: matchCoverage } = useGetMatchCoverageSuspense();
  //!SECTION HOOK호출 영역

  return (
    <AdminDashboardMatchCoverageWrapper>
      <h2 className="text-yds-s2 text-primary-100">경기별 평점 참여율</h2>
      {matchCoverage.length === 0 ? (
        <p className="text-yds-c1m text-primary-100">평점 데이터가 있는 경기가 없습니다.</p>
      ) : (
        <AdminDashboardMatchCoverageChart data={matchCoverage} />
      )}
    </AdminDashboardMatchCoverageWrapper>
  );
};

export default AdminDashboardMatchCoverage;
