/**
 * 작성자: KYD
 * 기능: 선수 DB 컴포넌트 - 가로 스크롤 형태의 선수 카드 목록
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import { useNavigate } from "react-router-dom";

import { HorizonDragScroll } from "@youngduck/yd-ui/HorizonDragScroll";

import { useAuth } from "@auth/contexts/AuthContext";

import { useGetPlayersDbWithMyRatings } from "@players/players-db/api/react-query-api/use-get-players-db-with-my-ratings";
import PlayersDbWrapper from "@players/players-db/components/wrapper/players-db-wrapper";

import { createPlayerStatsPath } from "@shared/constants/routes";

const PlayersDb = () => {
  //SECTION HOOK,상태값 영역
  const navigate = useNavigate();
  const { user } = useAuth();
  const PlayersDbWithMyRating = useGetPlayersDbWithMyRatings(user!.id);

  //!SECTION HOOK,상태값 영역

  //SECTION 메서드 영역
  const handlePlayerClick = (playerId: string) => {
    navigate(createPlayerStatsPath(playerId));
  };

  //!SECTION 메서드 영역

  return (
    <PlayersDbWrapper>
      {/* 가로 스크롤 컨테이너 */}
      <HorizonDragScroll className="w-full gap-1" data-testid="scroll-container">
        {PlayersDbWithMyRating.map((item) => (
          <li
            key={item.id}
            onClick={() => handlePlayerClick(item.id)}
            className="flex w-[105px] shrink-0 flex-col items-center gap-[16px] hover:cursor-pointer"
          >
            <img
              src={item.head_profile_image_url ?? undefined}
              alt={item.korean_name ?? undefined}
              className="h-[80px] w-[80px] object-cover"
            />
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
      </HorizonDragScroll>
    </PlayersDbWrapper>
  );
};

export default PlayersDb;
