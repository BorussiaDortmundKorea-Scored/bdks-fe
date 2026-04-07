import UserRankingWrapper from "@auth/auth-info/auth-info-quick-links/user-ranking/components/wrapper/user-ranking-wrapper";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const UserRankingErrorFallback = () => {
  return (
    <UserRankingWrapper>
      <div
        data-testid="user-ranking-error"
        className="text-yds-c1m text-primary-100 flex w-full flex-col items-center justify-center gap-3 rounded-lg px-4 py-6"
      >
        <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
        랭킹 정보를 불러오지 못했습니다. 다시 시도해 주세요.
      </div>
    </UserRankingWrapper>
  );
};

export default UserRankingErrorFallback;
