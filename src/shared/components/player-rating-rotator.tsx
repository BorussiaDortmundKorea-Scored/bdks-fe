/**
 * 작성자: KYD
 * 기능: 유저 이목을 끌기 위한 장치로 선수 누적 평점 주식처럼 표시
 * 프로세스 설명: SUPABASE RPC함수 - REACT QUERY 래핑 - 조회
 */
import { useGetRotatePlayerStatAcc } from "@shared/api/react-query-api/use-get-rotate-player-stat-acc";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

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
    <div className="relative w-[clamp(320px,100vw,500px)] overflow-hidden p-4">
      <div ref={containerRef} className="flex gap-6 text-lg text-white" style={{ width: "max-content" }}>
        {/* 첫 번째 세트 */}
        {data.map((item) => (
          <div key={`first-${item.korean_name}`} className="flex shrink-0 items-center gap-2">
            <span className="font-medium">{item.korean_name}</span>
            <span
              className={`font-bold ${
                item.overall_avg_rating && item.overall_avg_rating > 7 ? "text-rating-red" : "text-rating-blue"
              }`}
            >
              {item.overall_avg_rating || "0"}
            </span>
          </div>
        ))}

        {/* 두 번째 세트 (무한 스크롤용) */}
        {data.map((item) => (
          <div key={`second-${item.korean_name}`} className="flex shrink-0 items-center gap-2">
            <span className="font-medium">{item.korean_name}</span>
            <span
              className={`font-bold ${
                item.overall_avg_rating && item.overall_avg_rating > 8 ? "text-rating-red" : "text-rating-blue"
              }`}
            >
              {item.overall_avg_rating || "0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerRatingRotator;
