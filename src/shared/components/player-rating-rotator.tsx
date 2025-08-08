/**
 * 작성자: KYD
 * 기능: 유저 이목을 끌기 위한 장치로 선수 누적 평점 주식처럼 표시
 * 프로세스 설명: SUPABASE RPC함수 - REACT QUERY 래핑 - 조회
 */
import { useGetRotatePlayerStatAcc } from "@shared/api/react-query-api/use-get-rotate-player-stat-acc";

const PlayerRatingRotator = () => {
  //SECTION HOOK호출 영역
  const data = useGetRotatePlayerStatAcc();
  //!SECTION HOOK호출 영역

  return (
    <div className="flex w-full gap-3 overflow-x-hidden text-lg text-white">
      {data.map((item) => (
        <div key={item.korean_name} className="flex shrink-0 gap-1">
          {item.korean_name}
          <span
            className={item.overall_avg_rating && item.overall_avg_rating > 8 ? "text-rating-red" : "text-rating-blue"}
          >
            {item.overall_avg_rating || "0"}
          </span>
        </div>
      ))}
    </div>
  );
};

export default PlayerRatingRotator;
