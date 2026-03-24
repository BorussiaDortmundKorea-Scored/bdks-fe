/**
 * 작성자: KYD
 * 기능: 탈퇴 회원 통계 카드
 */
import { useGetDeletedUsersStatsSuspense } from "../api/react-query-api/use-get-deleted-users-stats";
import AdminDashboardDeletedUsersWrapper from "./wrapper/admin-dashboard-deleted-users-wrapper";

const AdminDashboardDeletedUsers = () => {
  //SECTION HOOK호출 영역
  const { data: deletedUsersStats } = useGetDeletedUsersStatsSuspense();
  //!SECTION HOOK호출 영역

  return (
    <AdminDashboardDeletedUsersWrapper>
      <h2>누적 탈퇴 회원</h2>
      <div className="flex w-full items-center justify-between text-white">
        <p className="text-yds-b1">{deletedUsersStats.total_deleted}명</p>
        <p className="text-yds-c1m flex items-center gap-1">
          <span>이번달</span>
          <span className="text-yds-b2 text-primary-400">{deletedUsersStats.this_month_deleted}명</span>
        </p>
      </div>
    </AdminDashboardDeletedUsersWrapper>
  );
};

export default AdminDashboardDeletedUsers;
