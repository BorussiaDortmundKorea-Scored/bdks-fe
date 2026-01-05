/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useGetUserTotalAndMonthlyPercentSuspense } from "../api/react-query-api/use-get-user-total-and-monthly-percent";
import AdminDashboardUserCountWrapper from "./wrapper/admin-dashboard-user-count-wrapper";

const AdminDashboardUserCount = () => {
  //SECTION HOOK호출 영역
  const { data: userTotalAndMonthlyPercent } = useGetUserTotalAndMonthlyPercentSuspense();
  //!SECTION HOOK호출 영역

  return (
    <AdminDashboardUserCountWrapper>
      <h2>회원 수</h2>
      <div className="flex w-full items-center justify-between text-white">
        <p className="text-yds-b1">{userTotalAndMonthlyPercent.total_users}명</p>
        <p className="text-yds-c1m flex items-center gap-1">
          <span className="">전월대비</span>
          <span className="text-yds-b2 text-primary-400">{userTotalAndMonthlyPercent.monthly_growth_percent}%</span>
        </p>
      </div>
    </AdminDashboardUserCountWrapper>
  );
};

export default AdminDashboardUserCount;
