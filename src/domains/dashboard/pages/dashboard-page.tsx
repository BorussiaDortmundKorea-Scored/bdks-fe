import Header from "@shared/components/layout/header";
import ContentScrollProvider from "@shared/provider/content-scroll-provider";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import PlayerDbErrorFallback from "@players/players-db/components/error/players-db-error-fallback";
import PlayerDb from "@players/players-db/components/players-db";
import PlayerDbSkeleton from "@players/players-db/components/skeleton/players-db-skeleton";

import MatchesHistory from "@matches/matches-history/components/matches-history";

const DashboardPage = () => {
  return (
    <div className="bdks-container">
      <Header />
      <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
        <MatchesHistory />
      </ReactQueryBoundary>
      <ContentScrollProvider>
        <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
          <PlayerDb />
        </ReactQueryBoundary>
      </ContentScrollProvider>
    </div>
  );
};

export default DashboardPage;
