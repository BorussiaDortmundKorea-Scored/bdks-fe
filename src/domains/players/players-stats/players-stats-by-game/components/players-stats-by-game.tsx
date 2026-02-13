/**
 * 작성자: KYD
 * 기능: 선수별 경기 통계 리스트 컴포넌트
 * 프로세스 설명: 선수가 출전한 경기 목록을 보여주고, 토글하여 세부 차트를 표시
 */
import { useState } from "react";

import { useGetPlayersStatsByGame } from "@players/players-stats/players-stats-by-game/api/react-query-api/use-get-players-stats-by-game";
import PlayerRatingByMatchDetailChart from "./player-rating-by-match-detail-chart";
import PlayersStatsByGameError from "./error/players-stats-by-game-error";
import PlayerRatingByMatchDetailChartSkeleton from "./skeleton/player-rating-by-match-detail-chart-skeleton";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

interface PlayersStatsByGameProps {
  playerId: string;
}

const PlayersStatsByGame = ({ playerId }: PlayersStatsByGameProps) => {
  //SECTION HOOK호출 영역
  const { data: matches } = useGetPlayersStatsByGame({ player_id: playerId });
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleToggleMatch = (matchId: string) => {
    setExpandedMatchId((prev) => (prev === matchId ? null : matchId));
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      {matches.map((match) => (
        <div key={match.id} className="bg-background-tertiary p-4">
          {/* 경기 정보 헤더 */}
          <button
            onClick={() => handleToggleMatch(match.id)}
            className="flex w-full cursor-pointer items-center justify-between"
            type="button"
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <span className="text-yds-s3 text-primary-100">{match.league_name}</span>
                <span className="text-yds-s3 text-gray-400">{match.season}</span>
                <span className="text-yds-s3 text-gray-400">
                  {match.text_home_away === "HOME" ? "홈" : "원정"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yds-s2 font-semibold text-white">{match.opponent_name}</span>
                {match.round_name && <span className="text-yds-s3 text-gray-400">{match.round_name}</span>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1">
                <div className="text-yds-s3 text-white">
                  {match.goals}골 {match.assists}도움
                </div>
                <div className="text-yds-s2 text-primary-100 font-semibold">{match.avg_rating.toFixed(1)}점</div>
              </div>
              <svg
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedMatchId === match.id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* 확장된 세부 차트 영역 */}
          {expandedMatchId === match.id && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <ReactQueryBoundary
                skeleton={<PlayerRatingByMatchDetailChartSkeleton />}
                errorFallback={PlayersStatsByGameError}
              >
                <PlayerRatingByMatchDetailChart matchId={match.id} playerId={playerId} />
              </ReactQueryBoundary>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayersStatsByGame;
