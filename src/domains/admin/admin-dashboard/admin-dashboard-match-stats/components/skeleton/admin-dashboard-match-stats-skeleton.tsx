/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 스켈레톤 UI
 */
import AdminDashboardMatchStatsWrapper from "../wrapper/admin-dashboard-match-stats-wrapper";

const AdminDashboardMatchStatsSkeleton = () => {
  return (
    <AdminDashboardMatchStatsWrapper>
      <div className="flex h-full w-full animate-pulse flex-col items-center justify-center gap-4 p-4">
        <div className="bg-background-secondary h-6 w-2/3 rounded"></div>
        <div className="flex h-3/4 w-full items-end justify-around gap-2">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="bg-background-secondary h-full w-full rounded"
              style={{ height: `${Math.random() * 70 + 30}%` }}
            ></div>
          ))}
        </div>
      </div>
    </AdminDashboardMatchStatsWrapper>
  );
};

export default AdminDashboardMatchStatsSkeleton;
