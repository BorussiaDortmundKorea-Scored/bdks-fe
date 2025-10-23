/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 차트 래퍼 컴포넌트
 */
const AdminDashboardMatchStatsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="card-navy-50 bg-background-tertiary col-start-1 col-end-7 row-start-5 row-end-8 h-full w-full overflow-hidden">
      {children}
    </div>
  );
};

export default AdminDashboardMatchStatsWrapper;
