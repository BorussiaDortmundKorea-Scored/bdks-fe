// src/domains/matches/matches-lastest/components/matches-lastest.tsx
import { useGetLatestMatchDatas } from "../api/react-query-api/use-get-lastest-match-datas";

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
  const { startingFormation, information } = useGetLatestMatchDatas();

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
          {Object.values(startingFormation).map((line, index) => (
            <div key={index} className="w-full h-[52px] flex items-center justify-around flex-nowrap">
              {line.map((player) => (
                <div key={player.player_id} className="relative w-[52px] h-[52px] shrink-0">
                  <img src={player.profile_image_url} alt={player.player_name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </MatchesLastestWrapper>
  );
};

export default MatchesLastest;
