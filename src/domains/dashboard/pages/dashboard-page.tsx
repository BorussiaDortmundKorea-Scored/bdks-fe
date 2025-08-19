import Header from "@shared/components/layout/header";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import PlayerDbErrorFallback from "@players/players-db/components/error/players-db-error-fallback";
import PlayerDb from "@players/players-db/components/players-db";
import PlayerDbSkeleton from "@players/players-db/components/skeleton/players-db-skeleton";

import MatchesHistoryErrorFallback from "@matches/matches-history/components/error/matches-history-error-fallback";
import MatchesHistory from "@matches/matches-history/components/matches-history";
import MatchesHistorySkeleton from "@matches/matches-history/components/skeleton/matches-history-skeleton";

const DashboardPage = () => {
  return (
    <div className="bdks-container">
      <Header />
      <ReactQueryBoundary skeleton={<MatchesHistorySkeleton />} errorFallback={MatchesHistoryErrorFallback}>
        <MatchesHistory />
      </ReactQueryBoundary>
      <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
        <PlayerDb />
      </ReactQueryBoundary>
    </div>
  );
};

export default DashboardPage;
