/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useGetAllFinishMatchLists } from "../api/react-query-api/use-get-all-finish-match-lists";
import MatchesHistoryWrapper from "./wrapper/matches-history-wrapper";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const CARD_SECTION_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund//card_section.png`;
//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const MatchesHistory = () => {
  //SECTION HOOK호출 영역
  const finishMatchLists = useGetAllFinishMatchLists();

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <MatchesHistoryWrapper>
      {/* 가로 스크롤 컨테이너 */}
      <ul className="scrollbar-hide-x flex w-full flex-row gap-5 overflow-x-scroll">
        {finishMatchLists.map((match) => (
          <li key={match.id} className="flex w-[180px] shrink-0 flex-col gap-2">
            <img src={CARD_SECTION_IMAGE} alt="Yellow Wall" className="h-[90px] w-[180px] rounded object-cover" />
            <div className="flex flex-col text-white">
              <div className="truncate text-sm">
                도르트문트({match.text_home_away === "HOME" ? "홈" : "원정"}) vs {match.opponent_name}
              </div>
              <div className="text-primary-100 text-xs">
                {match.league_name} {match.round_name}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </MatchesHistoryWrapper>
  );
};

export default MatchesHistory;
