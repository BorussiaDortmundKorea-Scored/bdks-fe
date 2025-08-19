/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGetAllFinishMatchLists } from "../api/react-query-api/use-get-all-finish-match-lists";
import MatchesHistoryWrapper from "./wrapper/matches-history-wrapper";

import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const CARD_SECTION_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund//card_section.png`;
//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const MatchesHistory = () => {
  //SECTION HOOK호출 영역
  const finishMatchLists = useGetAllFinishMatchLists();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{ startX: number; scrollLeft: number }>({ startX: 0, scrollLeft: 0 });

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleMatchCardClick = (matchId: string) => {
    navigate(`/match/${matchId}/ratings`);
  };

  // 마우스 드래그로 가로 스크롤
  const handleMouseDown: React.MouseEventHandler<HTMLUListElement> = (event) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    dragStateRef.current.startX = event.pageX - container.offsetLeft;
    dragStateRef.current.scrollLeft = container.scrollLeft;
  };

  const handleMouseMove: React.MouseEventHandler<HTMLUListElement> = (event) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    event.preventDefault();
    const x = event.pageX - container.offsetLeft;
    const walk = x - dragStateRef.current.startX; // 이동 거리
    container.scrollLeft = dragStateRef.current.scrollLeft - walk;
  };

  const handleMouseUpOrLeave: React.MouseEventHandler<HTMLUListElement> = () => {
    setIsDragging(false);
  };

  // 마우스 휠 세로 이동을 가로 스크롤로 변환 (트랙패드/마우스 모두 대응)
  const handleWheel: React.WheelEventHandler<HTMLUListElement> = (event) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const canScrollHorizontally = container.scrollWidth > container.clientWidth;
    if (!canScrollHorizontally) return;
    container.scrollLeft += event.deltaY;
  };
  //!SECTION 메서드 영역

  return (
    <MatchesHistoryWrapper>
      {/* 가로 스크롤 컨테이너 */}
      <ul
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className={`scrollbar-hide-x flex w-full flex-row gap-5 overflow-x-scroll select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {finishMatchLists.map((match) => (
          <li
            key={match.id}
            onClick={() => handleMatchCardClick(match.id)}
            className="flex w-[180px] shrink-0 flex-col gap-2 cursor-pointer"
          >
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
