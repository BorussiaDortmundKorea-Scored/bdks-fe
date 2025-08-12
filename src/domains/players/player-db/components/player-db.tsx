/**
 * 작성자: KYD
 * 기능:
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
  //!SECTION 메서드 영역

  return (
    <div>
      {data.map((item) => (
        <div key={item.korean_name}>
          <img src={item.head_profile_image_url ?? ""} alt={item.korean_name} />
          <div>{item.korean_name}</div>
          <div>{item.overall_avg_rating_all}</div>
          <div>{item.overall_avg_rating_my}</div>
        </div>
      ))}
    </div>
  );
};

export default PlayerDb;
