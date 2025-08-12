import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import Header from "@shared/components/layout/header";
import PlayerDb from "@players/player-db/components/player-db";
import AnimalListError from "@animals/components/animal-list/error/animal-list-error";
import ContentScrollProvider from "@shared/provider/content-scroll-provider";

const DashboardPage = () => {
  return (
    <div className="bdks-container">
      <Header />
      <ContentScrollProvider>
        <ReactQueryBoundary skeleton={<div>Loading...</div>} errorFallback={AnimalListError}>
          <PlayerDb />
        </ReactQueryBoundary>
      </ContentScrollProvider>
    </div>
  );
};

export default DashboardPage;
