// src/domains/matches/matches-lastest/matches-lastest-player-rating/components/matches-lastest-player-rating.tsx
/**
 * 작성자: KYD
 * 기능: 실시간 평점 화면. Broadcast 방식 실시간 통신
 * 프로세스 설명: Supabase Broadcast를 사용한 실시간 평점 시스템
 */
import { useParams } from "react-router-dom";

import { useInsertMatchPlayerRating } from "../api/react-query-api/use-insert-match-player-rating";
import { useRealtimeMatchPlayerRating } from "../api/react-query-api/use-realtime-match-player-rating";
import { Button } from "@youngduck/yd-ui";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const MatchesLastestPlayerRating = () => {
  //SECTION HOOK호출 영역
  const { matchId, playerId } = useParams();

  // broadcast 방식 실시간 구독이 포함된 훅 사용
  const { data: playerRating } = useRealtimeMatchPlayerRating({
    matchId: matchId!,
    playerId: playerId!,
  });

  const { mutateAsync: insertMatchPlayerRating, isPending: isInserting } = useInsertMatchPlayerRating();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleInsertMatchPlayerRating = async () => {
    try {
      await insertMatchPlayerRating({
        match_id: matchId!,
        player_id: playerId!,
        minute: Math.floor(Math.random() * 90) + 1, // 1-90분 랜덤
        rating: Math.floor(Math.random() * 10) + 1, // 1-10점 랜덤
      });
    } catch (error) {
      alert("이미입력한시간");
    }
  };
  //!SECTION 메서드 영역

  return (
    <>
      <LayoutWithHeaderFooter>
        <div className="w-full h-auto">
          <div className="flex flex-col gap-4">
            {/* 선수 정보 */}
            <div className="flex items-center gap-4 rounded-lg">
              <img
                src={playerRating?.full_profile_image_url}
                alt={playerRating?.korean_name}
                className="w-[300px] h-[300px] object-cover mx-auto"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-primary-100">{playerRating?.korean_name}</h2>
              <p className="text-white">{playerRating?.position_detail_name}</p>
            </div>

            {/* 실시간 평점 정보 */}
            <div className="flex justify-between items-center rounded-lg">
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-400" onClick={() => alert("zz")}>
                  실시간 평점
                  <span className="text-xs"> ({playerRating?.rating_count}명이 평가했어요)</span>
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-primary-400">{playerRating?.avg_rating}</p>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="실시간 업데이트 중" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutWithHeaderFooter>

      <div className="w-full h-auto flex justify-center items-center">
        <Button size="full" onClick={handleInsertMatchPlayerRating} isLoading={isInserting}>
          평점 입력하기
        </Button>
      </div>
    </>
  );
};

export default MatchesLastestPlayerRating;
