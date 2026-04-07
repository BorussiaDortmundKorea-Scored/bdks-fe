import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const AuthInfoProfileCardErrorFallback = () => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-3 rounded-lg p-4 text-yds-c1m text-primary-100"
      data-testid="auth-info-profile-card-error"
    >
      <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
      프로필 정보를 불러올 수 없습니다.
    </div>
  );
};

export default AuthInfoProfileCardErrorFallback;
