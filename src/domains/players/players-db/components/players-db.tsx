/**
 * 작성자: KYD
 * 기능: 선수 DB 컴포넌트 - 가로 스크롤 형태의 선수 카드 목록
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@auth/contexts/AuthContext";

import { useGetPlayersDbWithMyRatings } from "@players/players-db/api/react-query-api/use-get-players-db-with-my-ratings";
import PlayersDbWrapper from "@players/players-db/components/wrapper/players-db-wrapper";

import { createPlayerStatsPath } from "@shared/constants/routes";

const PlayersDb = () => {
  //SECTION HOOK,상태값 영역
  const navigate = useNavigate();
  const { user } = useAuth();
  const PlayersDbWithMyRating = useGetPlayersDbWithMyRatings(user!.id);
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  //!SECTION HOOK,상태값 영역

  //SECTION 메서드 영역
  const handlePlayerClick = (playerId: string) => {
    navigate(createPlayerStatsPath(playerId));
  };

  //SECTION 드래그/휠 스크롤 핸들러 영역

  const handleWheel: React.WheelEventHandler<HTMLUListElement> = (event) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const canScrollHorizontally = container.scrollWidth > container.clientWidth;
    if (!canScrollHorizontally) return;
    container.scrollLeft += event.deltaY;
  };
  //!SECTION 드래그/휠 스크롤 핸들러 영역

  //!SECTION 메서드 영역

  return (
    <PlayersDbWrapper>
      {/* 가로 스크롤 컨테이너 */}
      <ul
        ref={scrollContainerRef}
        onWheel={handleWheel}
        className={`scrollbar-hide-x flex w-full flex-row gap-[8px] overflow-x-scroll select-none`}
      >
        {PlayersDbWithMyRating.map((item) => (
          <li
            key={item.id}
            onClick={() => handlePlayerClick(item.id)}
            className="flex w-[105px] shrink-0 flex-col items-center gap-[16px] hover:cursor-pointer"
          >
            <img src={item.head_profile_image_url} alt={item.korean_name} className="h-[80px] w-[80px] object-cover" />
            <div className="flex flex-col items-center gap-[2px]">
              <div className="text-sm text-white">{item.korean_name}</div>
              <div className="text-primary-100 text-xs">
                <span data-testid="overall-rating">
                  All : {item.overall_avg_rating_all === null ? 0 : item.overall_avg_rating_all}
                </span>
                &nbsp;/&nbsp;
                <span data-testid="my-rating">
                  My : {item.overall_avg_rating_my === null ? 0 : item.overall_avg_rating_my}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </PlayersDbWrapper>
  );
};

export default PlayersDb;
