import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import Header from "@shared/components/layout/header";
import PlayerDb from "@players/players-db/components/players-db";
import ContentScrollProvider from "@shared/provider/content-scroll-provider";
import PlayerDbSkeleton from "@players/players-db/components/skeleton/players-db-skeleton";
import PlayerDbErrorFallback from "@players/players-db/components/error/players-db-error-fallback";

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
