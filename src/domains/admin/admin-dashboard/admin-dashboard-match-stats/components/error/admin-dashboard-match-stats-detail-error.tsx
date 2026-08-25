/**
 * 작성자: KYD
 * 기능: 경기별 유저 평점 입력 횟수 세부 차트 에러 폴백
 */
const AdminDashboardMatchStatsDetailError = () => {
  return (
    <div
      className="text-yds-c1m text-primary-100 flex h-[240px] w-full items-center justify-center"
      data-testid="admin-dashboard-match-stats-detail-error"
    >
      세부 통계를 불러오지 못했습니다.
    </div>
  );
};

export default AdminDashboardMatchStatsDetailError;
