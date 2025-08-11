/**
 * 작성자: KYD
 * 기능: 유저 이목을 끌기 위한 장치로 선수 누적 평점 주식처럼 표시
 * 프로세스 설명: SUPABASE RPC함수 - REACT QUERY 래핑 - 조회
 */
import { useGetRotatePlayerStatAcc } from "@players/players-rating-rotator/api/react-query-api/use-get-rotate-player-stat-acc";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import type { IRotatePlayerStatAccumulated } from "@players/players-rating-rotator/api/player-rating-rotator-api";

const PlayerRatingRotator = () => {
  //SECTION HOOK호출 영역
  const data = useGetRotatePlayerStatAcc();
  const containerRef = useRef<HTMLDivElement>(null);
  //!SECTION HOOK호출 영역

  useGSAP(
    () => {
      if (data.length > 0 && containerRef.current) {
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
    { dependencies: [data] },
  );

  return (
    <PlayerRatingRotatorWrapper>
      <div ref={containerRef} className="flex w-[max-content] gap-4">
        {/* 첫 번째 세트 */}
        {data.map((item) => (
          <PlayerRatingItem key={`first-${item.korean_name}`} {...item} />
        ))}
        {/* 두 번째 세트 (무한 회전용) */}
        {data.map((item) => (
          <PlayerRatingItem key={`second-${item.korean_name}`} {...item} />
        ))}
      </div>
    </PlayerRatingRotatorWrapper>
  );
};

export default PlayerRatingRotator;

const PlayerRatingItem = ({ korean_name, overall_avg_rating }: IRotatePlayerStatAccumulated) => {
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

export const PlayerRatingRotatorWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="relative w-[clamp(320px,100vw,500px)] overflow-hidden p-4 text-lg text-white">{children}</div>;
};
