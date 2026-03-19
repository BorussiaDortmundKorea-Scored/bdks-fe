/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 메인 컴포넌트
 */
import AdminDashboardMatchStatsChart from "./admin-dashboard-match-stats-chart";
import AdminDashboardMatchStatsWrapper from "./wrapper/admin-dashboard-match-stats-wrapper";

const AdminDashboardMatchStats = () => {
  return (
    <AdminDashboardMatchStatsWrapper>
      <h2 className="text-yds-s2">평점 입력 현황</h2>
      <AdminDashboardMatchStatsChart />
    </AdminDashboardMatchStatsWrapper>
  );
};

export default AdminDashboardMatchStats;
