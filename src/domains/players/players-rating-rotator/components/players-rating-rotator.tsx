/**
 * 작성자: KYD
 * 기능: 유저 이목을 끌기 위한 장치로 선수 누적 평점 주식처럼 표시
 * 프로세스 설명: SUPABASE RPC함수 - REACT QUERY 래핑 - 조회
 */
import { useRef } from "react";

import PlayersRatingRotatorWrapper from "./wrapper/players-rating-rotator-wrapper";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import type { IRotatePlayerStatAccumulated } from "@players/players-rating-rotator/api/players-rating-rotator-api";
import { useGetPlayersRatingRotatorAcc } from "@players/players-rating-rotator/api/react-query-api/use-get-players-rating-rotator-acc";

const PlayersRatingRotator = () => {
  //SECTION HOOK호출 영역
  const fetchPlayerData = useGetPlayersRatingRotatorAcc();
  const containerRef = useRef<HTMLDivElement>(null);
  //!SECTION HOOK호출 영역

  useGSAP(
    () => {
      if (fetchPlayerData.length > 0 && containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.scrollWidth;

        gsap.to(container, {
          x: -(containerWidth / 2),
          duration: containerWidth / 150,
          ease: "none",
          repeat: -1,
        });
      }
    },
    { dependencies: [fetchPlayerData] },
  );

  return (
    <PlayersRatingRotatorWrapper>
      <div ref={containerRef} className="flex w-[max-content] gap-4">
        {/* 첫 번째 세트 */}
        {fetchPlayerData.map((item) => (
          <PlayersRatingItem key={`first-${item.korean_name}`} {...item} />
        ))}
        {/* 두 번째 세트 (무한 회전용) */}
        {fetchPlayerData.map((item) => (
          <PlayersRatingItem key={`second-${item.korean_name}`} {...item} />
        ))}
      </div>
    </PlayersRatingRotatorWrapper>
  );
};

export default PlayersRatingRotator;

const PlayersRatingItem = ({ korean_name, overall_avg_rating }: IRotatePlayerStatAccumulated) => {
  const getRatingColor = (rating: number | null) => {
    if (!rating) return "text-rating-blue";
    return rating > 7 ? "text-rating-red" : "text-rating-blue";
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="font-medium">{korean_name}</span>
      <span className={`font-bold ${getRatingColor(overall_avg_rating)}`}>{overall_avg_rating || "0"}</span>
    </div>
  );
};
