/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 에러 폴백
 */
import AdminUserPopularPlayersWrapper from "@admin/admin-user/admin-user-popular-players/components/wrapper/admin-user-popular-players-wrapper";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const AdminUserPopularPlayersErrorFallback = () => {
  return (
    <AdminUserPopularPlayersWrapper>
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2"
        data-testid="admin-user-popular-players-error"
      >
        <img src={API_ERROR_LOGO} alt="에러" className="h-10 w-10" />
        <div className="text-yds-c1r text-primary-100">인기 최애선수 정보를 불러오지 못했습니다</div>
      </div>
    </AdminUserPopularPlayersWrapper>
  );
};

export default AdminUserPopularPlayersErrorFallback;
