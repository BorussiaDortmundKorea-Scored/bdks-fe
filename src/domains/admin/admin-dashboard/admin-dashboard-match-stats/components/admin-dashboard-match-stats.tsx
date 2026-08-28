/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계(평점 입력 현황) 단독 카드
 * 프로세스 설명: get_match_rating_stats 로 조회한 데이터를 StatsView(막대 차트 + 드릴다운)로 렌더한다.
 */
import { useGetMatchStats } from "../api/react-query-api/use-get-match-stats";
import AdminDashboardMatchStatsView from "./admin-dashboard-match-stats-view";
import AdminDashboardMatchStatsWrapper from "./wrapper/admin-dashboard-match-stats-wrapper";

const AdminDashboardMatchStats = () => {
  //SECTION HOOK호출 영역
  const matchStats = useGetMatchStats();
  //!SECTION HOOK호출 영역

  return (
    <AdminDashboardMatchStatsWrapper>
      <AdminDashboardMatchStatsView data={matchStats} title="평점 입력 현황" />
    </AdminDashboardMatchStatsWrapper>
  );
};

export default AdminDashboardMatchStats;
