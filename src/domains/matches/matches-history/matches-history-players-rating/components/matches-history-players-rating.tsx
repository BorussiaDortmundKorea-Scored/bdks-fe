/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import { useParams } from "react-router-dom";

import { useGetMatchesHistoryPlayersRatingSuspense } from "../api/react-query-api/use-get-matches-history-players-rating-suspense";
import MatchesHistoryPlayersRatingItem from "./matches-history-players-rating-item/matches-history-players-rating-item";
import MatchesHistoryPlayersRatingWrapper from "./wrapper/matches-history-players-rating-wrapper";
import { Camera } from "lucide-react";

interface IMatchesHistoryPlayersRating {}

const MatchesHistoryPlayersRating: React.FC<IMatchesHistoryPlayersRating> = () => {
  //SECTION HOOK호출 영역
  const { matchId } = useParams();
  const { data: matchesHistoryPlayersRating, matchInfo } = useGetMatchesHistoryPlayersRatingSuspense(matchId as string);

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <MatchesHistoryPlayersRatingWrapper>
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-yds-s2 text-white">도르트문트 vs {matchInfo.opponent_team_name}</h2>
          <p className="text-yds-c1m text-primary-100">
            {matchInfo.competition_name} {matchInfo.season}
          </p>
        </div>
        {/* <Camera size={24} className="text-primary-100 cursor-pointer" /> */}
      </header>
      <div className="text-yds-s2 text-primary-100">선수단 평점</div>
      <ul>
        {matchesHistoryPlayersRating.map((player) => (
          <MatchesHistoryPlayersRatingItem key={player.korean_name} player={player} />
        ))}
      </ul>
    </MatchesHistoryPlayersRatingWrapper>
  );
};

export default MatchesHistoryPlayersRating;
