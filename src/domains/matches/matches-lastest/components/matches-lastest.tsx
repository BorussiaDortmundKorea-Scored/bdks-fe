import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetLatestMatchDatas } from "../api/react-query-api/use-get-lastest-match-datas";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type IMatchesLastestInformation,
  type IMatchesLastestPlayer,
} from "@matches/matches-lastest/api/matches-lastest-api";
import MatchesLastestWrapper from "@matches/matches-lastest/components/wrapper/matches-lastest-wrapper";

import CurrentMatchTime from "@shared/components/match/current-match-time";
import { createMatchPlayerRatingsPath } from "@shared/constants/routes";

/**
 * 작성자: KYD
 * 기능: 최근 경기(라이브 & 종료) 포메이션 렌더링
 * 프로세스 설명:
 * 1. 포메이션 렌더링 선발명단: 축구 1선,2선,3선,4선,5선 순으로 float left 방식으로 구현
 * 2. 포메이션 렌더링 후보명단: 5선 밑에 후보명단 렌더링
 * 3. 라이브 경기의 경우 선수 클릭시 실시간 평점 입력창 이동
 * 4. 종료 경기의 경우 선수 클릭시  이동
 */
const MatchesLastest = () => {
  //SECTION HOOK호출 영역
  const { playingMembers, substitutedOutPlayers, unusedPlayers, information } = useGetLatestMatchDatas(); // 실시간 소켓통신 포함
  const [viewType, setViewType] = useState<"PLAY" | "NOT_PLAY">("PLAY");

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  //!SECTION 메서드 영역

  return (
    <MatchesLastestWrapper>
      {/* 상단부 : 경기정보 */}
      <div className="bg-background-secondary-layer flex h-full w-full flex-col rounded-[4px] p-2">
        <div className="flex h-auto w-full items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold text-white">
              도르트문트({information.home_away === "HOME" ? "H" : "A"}) vs {information.opponent_name}
            </div>
            <div className="text-primary-100 text-sm">
              {information.season} {information.league_name} {information.round_name}
            </div>
          </div>
          <CurrentMatchTime
            match_start_time={information.match_start_time}
            first_half_end_time={information.first_half_end_time}
            second_half_start_time={information.second_half_start_time}
            second_half_end_time={information.second_half_end_time}
            className="text-md text-primary-100 shrink-0 font-semibold"
          />
        </div>
        {/* 조건별 하단부 : 포메이션 선발 명단 렌더링 */}
        {viewType === "PLAY" && (
          <div className="flex h-auto w-full flex-1 flex-col justify-between py-4">
            {Object.values(playingMembers).map((line, index) => (
              <div key={index} className="flex h-auto w-full flex-nowrap items-center justify-around">
                {line.map((player) => (
                  <PlayerCard
                    key={player.player_id} // key 추가로 리렌더링 최적화
                    player={player}
                    information={information}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        {/* 조건별 하단부 : 포메이션 교체 명단 렌더링 */}
        {viewType === "NOT_PLAY" && (
          <div className="flex h-auto w-full flex-1 flex-col gap-4 overflow-y-auto py-4">
            {substitutedOutPlayers.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-yds-b2 text-white">교체 아웃</span>
                <div className="flex flex-wrap gap-3">
                  {substitutedOutPlayers.map((player) => (
                    <PlayerCard key={player.player_id} player={player} information={information} />
                  ))}
                </div>
              </div>
            )}
            {unusedPlayers.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-yds-b2 text-white">미출전</span>
                <div className="flex flex-wrap gap-3">
                  {unusedPlayers.map((player) => (
                    <PlayerCard key={player.player_id} player={player} information={information} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* 포메이션 뷰 타입 토글 버튼 */}
      <div className="bg-background-secondary-layer absolute right-4 bottom-4 z-10 flex overflow-hidden rounded-full shadow-lg backdrop-blur-sm">
        <button
          className={`text-yds-c1m px-3 py-1.5 transition-colors ${viewType === "PLAY" ? "text-primary-400" : "text-white"}`}
          onClick={() => setViewType("PLAY")}
        >
          선발
        </button>
        <button
          className={`text-yds-c1m px-3 py-1.5 transition-colors ${viewType === "NOT_PLAY" ? "text-primary-400" : "text-white"}`}
          onClick={() => setViewType("NOT_PLAY")}
        >
          교체
        </button>
      </div>
    </MatchesLastestWrapper>
  );
};

export default MatchesLastest;

const PlayerCard = ({
  player,
  information,
}: {
  player: IMatchesLastestPlayer;
  information: IMatchesLastestInformation;
}) => {
  const { toast } = useOverlay();

  const isUnplayedPlayer = player.lineup_type === "BENCH" && player.substitution_status !== "SUBSTITUTED_IN";

  const handleClick = (e: React.MouseEvent) => {
    if (isUnplayedPlayer) {
      e.preventDefault();
      toast({ content: `미출전 선수는 평점을 입력할 수 없어요` });
    }
  };

  return (
    <Link
      to={createMatchPlayerRatingsPath(information.match_id, player.player_id)}
      className="xs:w-[52px] xs:h-[52px] relative shrink-0 cursor-pointer sm:h-[60px] sm:w-[60px] md:h-[66px] md:w-[66px]"
      onClick={handleClick}
      aria-disabled={isUnplayedPlayer}
      aria-label={`${player.player_name} 평점 입력`}
    >
      {/* 선수 이미지 컨테이너 */}
      <div className="border-primary-400 relative h-full w-full overflow-hidden rounded-full border-2 shadow-lg">
        {/* 실제 선수 이미지 */}
        <img src={player.profile_image_url} alt={player.player_name} className="h-full w-full object-cover" />

        {/* 그림자 오버레이 */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80" />
      </div>

      {/* 평점 오버레이 - 실시간 애니메이션 추가 */}
      <div className="border-primary-400 absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-black shadow-lg">
        <span className="text-xs font-bold text-white transition-all duration-300 ease-out">{player.avg_rating}</span>
      </div>
    </Link>
  );
};
