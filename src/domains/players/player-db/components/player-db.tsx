/**
 * 작성자: KYD
 * 기능: 선수 DB 컴포넌트 - 가로 스크롤 형태의 선수 카드 목록
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import { useGetPlayerDBWithMyRatings } from "../api/react-query-api/use-get-player-db-with-my-ratings";
import { useAuth } from "@auth/contexts/AuthContext";
import PlayerRatingRotatorErrorFallback from "@players/players-rating-rotator/components/player-rating-rotator/error/player-rating-rotator-error-fallback";

interface IPlayerDb {}

const PlayerDb: React.FC<IPlayerDb> = () => {
  //SECTION HOOK,상태값 영역
  const { user } = useAuth();
  // 방어적 프로그래밍처리 - 라우터에서 이미 user존재여부 체크함
  if (!user) {
    return <PlayerRatingRotatorErrorFallback />;
  }
  const data = useGetPlayerDBWithMyRatings(user.id);

  //!SECTION HOOK,상태값 영역

  //SECTION 메서드 영역
  const handlePlayerClick = (playerId: string) => {
    if (user?.is_anonymous) {
      // 익명 사용자: 팝업 표시
      alert("익명 로그인 사용자는 이용할 수 없습니다");
    } else {
      // 카카오 로그인 사용자: 상세 페이지 이동
      // navigate(`/player/${playerId}/stats`);
      alert("준비중입니다.");
      console.log("선수 상세 페이지로 이동:", playerId);
    }
  };

  //!SECTION 메서드 영역

  return (
    <section className="text-primary-100 w-full">
      <h2 className="mb-4 text-[22px] font-bold">선수 DB</h2>

      {/* 가로 스크롤 컨테이너 */}
      <ul className="scrollbar-hide-x flex w-full flex-row gap-[8px] overflow-x-scroll">
        {data.map((item) => (
          <li
            key={item.id}
            onClick={() => handlePlayerClick(item.id)}
            className="flex w-[105px] shrink-0 flex-col items-center gap-[16px]"
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
    </section>
  );
};

export default PlayerDb;
