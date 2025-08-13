import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import Header from "@shared/components/layout/header";
import PlayerDb from "@players/player-db/components/player-db";
import ContentScrollProvider from "@shared/provider/content-scroll-provider";
import PlayerDbSkeleton from "@players/player-db/components/skeleton/player-db-skeleton";
import PlayerDbErrorFallback from "@players/player-db/components/error/player-db-error-fallback";

const DashboardPage = () => {
  return (
    <div className="bdks-container">
      <Header />
      <ContentScrollProvider>
        <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
          <PlayerDb />
        </ReactQueryBoundary>
      </ContentScrollProvider>
    </div>
  );
};

export default DashboardPage;
