/**
 * 작성자: KYD
 * 기능: 회원 유형 파이 차트 스켈레톤
 * 프로세스 설명: 본체의 제목 + 120px 차트 영역과 같은 높이를 잡아 로딩 중 레이아웃이 튀지 않게 한다.
 */
import AdminDashboardUserLoginTypeWrapper from "../wrapper/admin-dashboard-user-login-type-wrapper";

const AdminDashboardUserLoginTypeSkeleton = () => {
  return (
    <AdminDashboardUserLoginTypeWrapper>
      <div
        data-testid="admin-dashboard-user-login-type-skeleton"
        className="h-[120px] w-full animate-pulse rounded-md bg-white/5"
      />
    </AdminDashboardUserLoginTypeWrapper>
  );
};

export default AdminDashboardUserLoginTypeSkeleton;
