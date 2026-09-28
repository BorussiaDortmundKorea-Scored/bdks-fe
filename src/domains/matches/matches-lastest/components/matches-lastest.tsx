/**
 * 작성자: KYD
 * 기능: 최근 경기(라이브 & 종료) 포메이션 렌더링
 * 프로세스 설명: 경기 평점 화면(matches-history-players-rating)과 같은 공용 FormationBoard 를 쓴다.
 *              이 화면만의 차이는 헤더 우측 진행 시간과, 카드를 눌러 평점 입력으로 가는 링크다.
 */
import { useGetLatestMatchDatas } from "../api/react-query-api/use-get-lastest-match-datas";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import CurrentMatchTime from "@shared/components/match/current-match-time";
import FormationBoard from "@shared/components/match/formation/formation-board";
import { createMatchPlayerRatingsPath } from "@shared/constants/routes";

const MatchesLastest = () => {
  //SECTION HOOK호출 영역
  const { playingMembers, substitutedOutPlayers, unusedPlayers, information } = useGetLatestMatchDatas(); // 실시간 소켓통신 포함
  const { toast } = useOverlay();
  //!SECTION HOOK호출 영역

  return (
    <FormationBoard
      title={`도르트문트(${information.home_away === "HOME" ? "H" : "A"}) vs ${information.opponent_name}`}
      subtitle={`${information.season} ${information.league_name} ${information.round_name}`}
      headerRight={
        <CurrentMatchTime
          match_start_time={information.match_start_time}
          first_half_end_time={information.first_half_end_time}
          second_half_start_time={information.second_half_start_time}
          second_half_end_time={information.second_half_end_time}
          className="text-md text-primary-100 shrink-0 font-semibold"
        />
      }
      playingMembers={playingMembers}
      substitutedOutPlayers={substitutedOutPlayers}
      unusedPlayers={unusedPlayers}
      getPlayerLink={(player) => createMatchPlayerRatingsPath(information.match_id, player.playerId)}
      unusedPlayerDisabledReason="미출전 선수는 평점을 입력할 수 없어요"
      onDisabledPlayerClick={(reason) => toast({ content: reason })}
    />
  );
};

export default MatchesLastest;
