/**
 * 작성자: KYD
 * 기능: (실험) 넓은 대시보드 우측 사이드 패널 - 하위 위젯 조합(aggregator)
 * 프로세스 설명: ① 구단 우승 트로피 진열 ② TOP 선수 기록. 각 위젯은 별도 하위기능 폴더에서 관리.
 */
import DashboardTopPlayers from "@dashboard/dashboard-top-players/components/dashboard-top-players";
import DashboardTopPlayersErrorFallback from "@dashboard/dashboard-top-players/components/error/dashboard-top-players-error-fallback";
import DashboardTopPlayersSkeleton from "@dashboard/dashboard-top-players/components/skeleton/dashboard-top-players-skeleton";
import DashboardTrophy from "@dashboard/dashboard-trophy/components/dashboard-trophy";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const DashboardSidePanel = () => {
  return (
    <aside className="flex w-full flex-col gap-6">
      <DashboardTrophy />

      <ReactQueryBoundary skeleton={<DashboardTopPlayersSkeleton />} errorFallback={DashboardTopPlayersErrorFallback}>
        <DashboardTopPlayers />
      </ReactQueryBoundary>
    </aside>
  );
};

export default DashboardSidePanel;
