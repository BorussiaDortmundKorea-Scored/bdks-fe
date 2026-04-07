import UserRankingWrapper from "@auth/auth-info/auth-info-quick-links/user-ranking/components/wrapper/user-ranking-wrapper";

const PodiumSkeleton = () => (
  <div className="flex items-end justify-center gap-4">
    {/* 2등 */}
    <div className="flex flex-col items-center gap-2">
      <div className="bg-background-tertiary h-5 w-5 animate-pulse rounded-full" />
      <div className="bg-background-tertiary h-16 w-16 animate-pulse rounded-full" />
      <div className="bg-background-tertiary h-4 w-16 animate-pulse rounded" />
      <div className="bg-background-tertiary h-20 w-24 animate-pulse rounded-t-lg" />
    </div>
    {/* 1등 */}
    <div className="flex flex-col items-center gap-2">
      <div className="bg-background-tertiary h-7 w-7 animate-pulse rounded-full" />
      <div className="bg-background-tertiary h-20 w-20 animate-pulse rounded-full" />
      <div className="bg-background-tertiary h-4 w-16 animate-pulse rounded" />
      <div className="bg-background-tertiary h-28 w-24 animate-pulse rounded-t-lg" />
    </div>
    {/* 3등 */}
    <div className="flex flex-col items-center gap-2">
      <div className="bg-background-tertiary h-5 w-5 animate-pulse rounded-full" />
      <div className="bg-background-tertiary h-14 w-14 animate-pulse rounded-full" />
      <div className="bg-background-tertiary h-4 w-16 animate-pulse rounded" />
      <div className="bg-background-tertiary h-16 w-24 animate-pulse rounded-t-lg" />
    </div>
  </div>
);

const UserRankingSkeleton = () => {
  return (
    <UserRankingWrapper>
      <div data-testid="user-ranking-skeleton" />

      {/* 평점 입력 횟수 섹션 */}
      <div className="bg-background-tertiary h-5 w-48 animate-pulse rounded" />
      <PodiumSkeleton />

      {/* 직관 횟수 섹션 */}
      <div className="bg-background-tertiary h-5 w-40 animate-pulse rounded" />
      <PodiumSkeleton />
    </UserRankingWrapper>
  );
};

export default UserRankingSkeleton;
