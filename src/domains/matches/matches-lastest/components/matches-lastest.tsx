// src/domains/matches/matches-lastest/components/matches-lastest.tsx
import { useGetLatestMatchDatas } from "../api/react-query-api/use-get-lastest-match-datas";

import { type IMatchesLastestPlayer } from "@matches/matches-lastest/api/matches-lastest-api";
import MatchesLastestWrapper from "@matches/matches-lastest/components/wrapper/matches-lastest-wrapper";

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
  const { playingMembers, information } = useGetLatestMatchDatas();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <MatchesLastestWrapper>
      {/* 상단부 : 경기정보 */}
      <div className="w-full h-full p-2 rounded-[4px] bg-background-secondary/70 flex flex-col">
        <div className="w-full h-auto flex justify-between items-center gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-lg font-semibold text-white">
              도르트문트({information.home_away === "HOME" ? "H" : "A"}) vs {information.opponent_name}
            </div>
            <div className="text-sm text-primary-100 ">
              {information.season} {information.league_name} {information.round_name}
            </div>
          </div>
          <div className="text-md font-semibold text-primary-100 shrink-0">
            {information.is_live ? "경기중!" : "경기종료"}
          </div>
        </div>
        {/* 하단부 : 포메이션 렌더링 */}
        <div className="w-full h-auto flex flex-1 flex-col justify-between py-4">
          {Object.values(playingMembers).map((line, index) => (
            <div key={index} className="w-full h-auto flex items-center justify-around flex-nowrap">
              {line.map((player) => (
                <PlayerCard player={player} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </MatchesLastestWrapper>
  );
};

export default MatchesLastest;

const PlayerCard = ({ player }: { player: IMatchesLastestPlayer }) => {
  return (
    <div className="relative xs:w-[52px] xs:h-[52px] sm:w-[60px] sm:h-[60px] md:w-[66px] md:h-[66px] shrink-0">
      {/* 체크무늬 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-primary-200 rounded-full">
        <div className="w-full h-full bg-[repeating-conic-gradient(from_0deg,transparent_0deg_8deg,rgba(255,255,255,0.03)_8deg_16deg)] rounded-full" />
      </div>
      {/* 선수 이미지 컨테이너 */}
      <div className="relative w-full h-full rounded-full overflow-hidden  border-2 border-primary-400 shadow-lg">
        {/* 실제 선수 이미지 */}
        <img src={player.profile_image_url} alt={player.player_name} className="object-cover w-full h-full" />

        {/* 그림자 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
      </div>

      {/* 평점 오버레이 */}
      <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-black rounded-full border-2 border-primary-400 flex items-center justify-center shadow-lg">
        <span className="text-white text-xs font-bold">{player.avg_rating}</span>
      </div>
    </div>
  );
};
