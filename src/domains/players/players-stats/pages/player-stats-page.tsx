/**
 * 작성자: KYD
 * 기능: 최근 경기 선수 평가 페이지 (경기중 + 다음경기 시작전까지 평점 입력 가능)
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { Line } from "react-chartjs-2";
import { useParams } from "react-router-dom";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { useGetPlayerStats } from "@players/players-stats/api/react-query-api/use-get-player-stats";
import {
  playerStatsChartData,
  playerStatsChartOptions,
} from "@players/players-stats/constants/player-stats-chart-config";
import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayersStatsByGame from "@players/players-stats/players-stats-by-game/components/players-stats-by-game";
import PlayersStatsByGameSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/players-stats-by-game-skeleton";

import BackButton from "@shared/components/layout/header/buttons/back-button";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import LayoutWithHeader from "@shared/provider/layout-with-header";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

// Chart.js 필수 요소 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const headerOptions = {
  leftIcon: <BackButton />,
};
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const PlayerStatsPage = () => {
  //SECTION HOOK호출 영역
  const { pageRef } = usePageTransition();
  const { playerId } = useParams<{ playerId: string }>() as { playerId: string };
  const { data: playerStats } = useGetPlayerStats({ player_id: playerId });
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역
  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={headerOptions} />
      <LayoutWithHeader>
        {/* 선수 이미지 영역 */}
        <div className="flex flex-col items-start gap-3">
          <img
            src={playerStats.full_profile_image_url}
            alt={playerStats.korean_name}
            className="mx-auto h-[300px] w-[300px] rounded-lg object-cover"
          />
          <div className="w-full text-center">
            <h2 className="text-primary-100 text-yds-s2">{playerStats.korean_name}</h2>
          </div>
        </div>
        <Line options={playerStatsChartOptions} data={playerStatsChartData} />
        {/* 선수별 경기 통계 리스트 */}
        <ReactQueryBoundary skeleton={<PlayersStatsByGameSkeleton />} errorFallback={PlayersStatsByGameError}>
          <PlayersStatsByGame playerId={playerId} />
        </ReactQueryBoundary>
      </LayoutWithHeader>
    </div>
  );
};

export default PlayerStatsPage;
