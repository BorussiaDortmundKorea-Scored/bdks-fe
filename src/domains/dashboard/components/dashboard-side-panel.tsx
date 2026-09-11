/**
 * 작성자: KYD
 * 기능: (실험) 넓은 대시보드 우측 사이드 패널 - 하위 위젯 조합(aggregator)
 * 프로세스 설명: ① 다가오는 경기 일정 ② 구단 우승 트로피 진열 ③ TOP 선수 기록. 각 위젯은 별도 하위기능 폴더에서 관리.
 */
import DashboardFixtures from "@dashboard/dashboard-fixtures/components/dashboard-fixtures";
import DashboardFixturesErrorFallback from "@dashboard/dashboard-fixtures/components/error/dashboard-fixtures-error-fallback";
import DashboardFixturesSkeleton from "@dashboard/dashboard-fixtures/components/skeleton/dashboard-fixtures-skeleton";
import DashboardTopPlayers from "@dashboard/dashboard-top-players/components/dashboard-top-players";
import DashboardTopPlayersErrorFallback from "@dashboard/dashboard-top-players/components/error/dashboard-top-players-error-fallback";
import DashboardTopPlayersSkeleton from "@dashboard/dashboard-top-players/components/skeleton/dashboard-top-players-skeleton";
import DashboardTrophy from "@dashboard/dashboard-trophy/components/dashboard-trophy";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const DashboardSidePanel = () => {
  return (
    <aside className="flex w-full flex-col gap-6">
      <ReactQueryBoundary skeleton={<DashboardFixturesSkeleton />} errorFallback={DashboardFixturesErrorFallback}>
        <DashboardFixtures />
      </ReactQueryBoundary>

      <DashboardTrophy />

      <ReactQueryBoundary skeleton={<DashboardTopPlayersSkeleton />} errorFallback={DashboardTopPlayersErrorFallback}>
        <DashboardTopPlayers />
      </ReactQueryBoundary>
    </aside>
  );
};

export default DashboardSidePanel;
