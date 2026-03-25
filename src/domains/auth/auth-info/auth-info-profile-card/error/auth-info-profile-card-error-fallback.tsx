/**
 * 프로필 카드 에러 폴백
 */
const AuthInfoProfileCardErrorFallback = () => {
  return (
    <div
      className="flex w-full flex-col items-center justify-center rounded-lg p-4 text-yds-c1m text-primary-100"
      data-testid="auth-info-profile-card-error"
    >
      프로필 정보를 불러올 수 없습니다.
    </div>
  );
};

export default AuthInfoProfileCardErrorFallback;
