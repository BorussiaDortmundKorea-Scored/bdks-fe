/**
 * 작성자: KYD
 * 기능: 회원 수 통계 카드 스켈레톤
 * 프로세스 설명: 본체(제목 + "총 N명 / 전월대비 N%" 한 줄)와 같은 골격을 깔아
 *              로딩이 끝나는 순간 레이아웃이 튀지 않게 한다.
 */
import AdminDashboardUserCountWrapper from "../wrapper/admin-dashboard-user-count-wrapper";

const AdminDashboardUserCountSkeleton = () => {
  return (
    <AdminDashboardUserCountWrapper>
      <div data-testid="admin-dashboard-user-count-skeleton" className="flex w-full items-center justify-between">
        <div className="h-7 w-24 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-28 animate-pulse rounded bg-white/5" />
      </div>
    </AdminDashboardUserCountWrapper>
  );
};

export default AdminDashboardUserCountSkeleton;
