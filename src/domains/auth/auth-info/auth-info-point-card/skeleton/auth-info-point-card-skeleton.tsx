/**
 * 포인트 카드 로딩 스켈레톤
 */
const AuthInfoPointCardSkeleton = () => {
  return (
    <div
      className="bg-background-tertiary card-navy-50 col-span-2 row-span-4 flex h-full w-full flex-col justify-between rounded-lg p-4"
      data-testid="auth-info-point-card-skeleton"
    >
      <div className="flex flex-col gap-2">
        <div className="h-5 w-12 animate-pulse rounded bg-gray-600" />
        <div className="h-6 w-16 animate-pulse rounded bg-gray-600" />
      </div>
      <div className="flex justify-end">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-600" />
      </div>
    </div>
  );
};

export default AuthInfoPointCardSkeleton;
