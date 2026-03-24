/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 차트 래퍼 컴포넌트
 */
const AdminDashboardMatchStatsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-background-tertiary text-primary-100 card-navy-50 flex h-full w-full flex-col justify-center md:col-start-1 md:col-end-7 md:row-start-4 md:row-end-7">
      {children}
    </div>
  );
};

export default AdminDashboardMatchStatsWrapper;
