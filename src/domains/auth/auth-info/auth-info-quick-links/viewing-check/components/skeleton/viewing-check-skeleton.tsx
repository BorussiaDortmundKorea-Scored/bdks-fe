import ViewingCheckWrapper from "@auth/auth-info/auth-info-quick-links/viewing-check/components/wrapper/viewing-check-wrapper";

const ViewingCheckSkeleton = () => {
  const cardIndexes = Array.from({ length: 6 }, (_, index) => index);

  return (
    <ViewingCheckWrapper>
      <div data-testid="viewing-check-skeleton" />
      {/* 헤더 스켈레톤 */}
      <div className="flex h-6 items-center justify-between">
        <div className="bg-background-tertiary h-full w-24 animate-pulse rounded" />
        <div className="bg-background-tertiary h-full w-16 animate-pulse rounded" />
      </div>

      {/* 진행률 바 스켈레톤 */}
      <div className="bg-background-tertiary h-2 w-full animate-pulse overflow-hidden rounded-full" />

      {/* 도감 그리드 스켈레톤 */}
      <div className="grid grid-cols-3 gap-3">
        {cardIndexes.map((index) => (
          <div key={index} className="bg-background-tertiary flex animate-pulse flex-col overflow-hidden rounded-lg">
            <div className="flex items-center justify-between px-2 pt-2">
              <div className="bg-background-tertiary h-3 w-6" />
              <div className="bg-background-tertiary h-3 w-4" />
            </div>
            <div className="flex aspect-square items-center justify-center p-3">
              <div className="bg-background-tertiary h-full w-full animate-pulse rounded-full" />
            </div>
            <div className="flex flex-col gap-1 px-2 pb-2">
              <div className="bg-background-tertiary h-3 w-full animate-pulse rounded" />
              <div className="bg-background-tertiary h-3 w-2/3 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    </ViewingCheckWrapper>
  );
};

export default ViewingCheckSkeleton;
