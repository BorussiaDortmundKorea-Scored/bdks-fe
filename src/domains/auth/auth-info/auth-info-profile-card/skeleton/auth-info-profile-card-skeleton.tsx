/**
 * 프로필 카드 로딩 스켈레톤
 */
const AuthInfoProfileCardSkeleton = () => {
  return (
    <div
      className="flex w-full flex-col items-center gap-3"
      data-testid="auth-info-profile-card-skeleton"
    >
      <div className="h-20 w-20 animate-pulse rounded-full bg-gray-600" />
      <div className="flex flex-col items-center gap-1">
        <div className="h-5 w-20 animate-pulse rounded bg-gray-600" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-gray-600" />
      </div>
    </div>
  );
};

export default AuthInfoProfileCardSkeleton;
