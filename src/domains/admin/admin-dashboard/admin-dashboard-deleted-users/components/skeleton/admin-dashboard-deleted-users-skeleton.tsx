/**
 * 작성자: KYD
 * 기능: 탈퇴 회원 통계 카드 스켈레톤
 * 프로세스 설명: 본체(제목 + "누적 N명 / 이번달 N명" 한 줄)와 같은 골격을 깔아
 *              로딩이 끝나는 순간 레이아웃이 튀지 않게 한다.
 */
import AdminDashboardDeletedUsersWrapper from "../wrapper/admin-dashboard-deleted-users-wrapper";

const AdminDashboardDeletedUsersSkeleton = () => {
  return (
    <AdminDashboardDeletedUsersWrapper>
      <div data-testid="admin-dashboard-deleted-users-skeleton" className="flex w-full items-center justify-between">
        <div className="h-7 w-24 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-24 animate-pulse rounded bg-white/5" />
      </div>
    </AdminDashboardDeletedUsersWrapper>
  );
};

export default AdminDashboardDeletedUsersSkeleton;
