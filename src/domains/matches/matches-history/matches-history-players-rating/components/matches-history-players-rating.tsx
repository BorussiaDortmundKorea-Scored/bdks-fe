/**
 * 작성자: KYD
 * 기능: 종료된 경기 선수 평점 포메이션 렌더링
 * 프로세스 설명: 최신경기(matches-lastest)와 같은 공용 FormationBoard 를 쓴다.
 *              이 화면만의 차이는 헤더 우측에 진행 시간 대신 스코어를 둔다는 것뿐이다.
 */
import { useParams } from "react-router-dom";

import { useGetMatchesHistoryPlayersRatingSuspense } from "../api/react-query-api/use-get-matches-history-players-rating-suspense";
import MatchSummaryPanel from "../match-summary-panel/components/match-summary-panel";
import { PLAYERS_RATING_GRID_CLASS } from "./wrapper/matches-history-players-rating-wrapper";

import FormationBoard from "@shared/components/match/formation/formation-board";

const MatchesHistoryPlayersRating = () => {
  //SECTION HOOK호출 영역
  const { matchId } = useParams();
  const { data, playingMembers, substitutedOutPlayers, unusedPlayers, matchInfo } =
    useGetMatchesHistoryPlayersRatingSuspense(matchId as string);
  //!SECTION HOOK호출 영역

  return (
    <div className={PLAYERS_RATING_GRID_CLASS}>
      <FormationBoard
        title={`도르트문트(${matchInfo.home_away === "HOME" ? "H" : "A"}) vs ${matchInfo.opponent_team_name}`}
        subtitle={`${matchInfo.season} ${matchInfo.competition_name}`}
        headerRight={
          // 최신경기는 진행 시간(CurrentMatchTime)을 두지만 이 화면은 종료된 경기라 스코어를 둔다
          <div className="text-md text-primary-100 shrink-0 font-semibold">
            {matchInfo.our_score} : {matchInfo.opponent_score}
          </div>
        }
        playingMembers={playingMembers}
        substitutedOutPlayers={substitutedOutPlayers}
        unusedPlayers={unusedPlayers}
      />
      <MatchSummaryPanel players={data} matchInfo={matchInfo} />
    </div>
  );
};

export default MatchesHistoryPlayersRating;
