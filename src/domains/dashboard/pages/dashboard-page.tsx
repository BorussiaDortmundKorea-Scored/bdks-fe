import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import LogoutButton from "../../../shared/components/LogoutButton";
import PlayerDb from "@dashboard/domains/player-db/player-db";
import AnimalListError from "@animals/components/animal-list/error/animal-list-error";

const DashboardPage = () => {
  return (
    <div className="containerabc">
      {/* 헤더 영역 */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">축구 평점 시스템</h1>
        <LogoutButton />
      </div>
      <ReactQueryBoundary skeleton={<div>Loading...</div>} errorFallback={AnimalListError}>
        <PlayerDb />
      </ReactQueryBoundary>
    </div>
  );
};

export default DashboardPage;
