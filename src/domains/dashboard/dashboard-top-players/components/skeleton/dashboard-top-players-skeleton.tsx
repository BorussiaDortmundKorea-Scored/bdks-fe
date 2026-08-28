/**
 * 작성자: KYD
 * 기능: TOP PLAYERS 카드 스켈레톤 (2x2 격자)
 */
import DashboardTopPlayersWrapper from "../wrapper/dashboard-top-players-wrapper";

const DashboardTopPlayersSkeleton = () => {
  return (
    <DashboardTopPlayersWrapper>
      <div className="grid grid-cols-2 gap-3" data-testid="dashboard-top-players-skeleton">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-[160px] w-full animate-pulse rounded-md bg-white/5" />
        ))}
      </div>
    </DashboardTopPlayersWrapper>
  );
};

export default DashboardTopPlayersSkeleton;
