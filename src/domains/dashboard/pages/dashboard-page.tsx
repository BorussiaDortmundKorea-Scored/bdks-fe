import LogoutButton from "../../../shared/components/LogoutButton";
import PlayerDb from "@dashboard/domains/player-db/player-db";

const DashboardPage = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 영역 */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">축구 평점 시스템</h1>
          <LogoutButton />
        </div>
        <PlayerDb />
      </div>
    </div>
  );
};

export default DashboardPage;
