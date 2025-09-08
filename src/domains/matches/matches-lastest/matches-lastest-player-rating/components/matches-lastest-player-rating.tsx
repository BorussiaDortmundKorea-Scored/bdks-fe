// src/domains/matches/matches-lastest/matches-lastest-player-rating/components/matches-lastest-player-rating.tsx
/**
 * 작성자: KYD
 * 기능: 실시간 평점 화면. Broadcast 방식 실시간 통신
 * 프로세스 설명: Supabase Broadcast를 사용한 실시간 평점 시스템
 */
import { useState } from "react";
import { useParams } from "react-router-dom";

import { useInsertMatchPlayerRating } from "../api/react-query-api/use-insert-match-player-rating";
import { useRealtimeMatchPlayerRating } from "../api/react-query-api/use-realtime-match-player-rating";
import RatingGaugeInput from "../rating-gauge-input/components/rating-gauge-input";
import type { IInsertPlayerRatingRequest } from "../types";
import { Button } from "@youngduck/yd-ui";

// import { Camera } from "lucide-react";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const MatchesLastestPlayerRating = () => {
  //SECTION HOOK호출 영역
  const { matchId, playerId } = useParams();
  const [selectedRating, setSelectedRating] = useState<number>(5.0);

  // broadcast 방식 실시간 구독이 포함된 훅 사용
  const { data: playerRating } = useRealtimeMatchPlayerRating({
    matchId: matchId!,
    playerId: playerId!,
  });

  const { mutateAsync: insertMatchPlayerRating, isPending: isInserting } = useInsertMatchPlayerRating();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleRatingChangeEnd = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleInsertMatchPlayerRating = async () => {
    try {
      const request: IInsertPlayerRatingRequest = {
        match_id: matchId!,
        player_id: playerId!,
        minute: Math.floor(Math.random() * 90) + 1,
        rating: selectedRating,
      };

      await insertMatchPlayerRating(request);
      // 성공 시 폼 초기화는 하지 않고 사용자가 다시 평점을 수정할 수 있도록 함
    } catch (error) {
      alert("이미 해당 시간에 평점을 입력했습니다.");
    }
  };
  //!SECTION 메서드 영역

  return (
    <>
      <LayoutWithHeaderFooter>
        <div className="h-auto w-full py-6">
          <div className="flex flex-col gap-3">
            {/* 경기 정보 헤더 */}
            <div className="flex items-center justify-between px-4">
              <div className="flex flex-col flex-wrap gap-0">
                <div className="text-yds-s2 text-white">도르트문트 vs {playerRating.opponent_team_name}</div>
                <div className="text-yds-b2 text-primary-100">
                  {playerRating.season} {playerRating.league_name} {playerRating.round_name}
                </div>
              </div>
              {/* TODO: 카메라 버튼 기능 제공예정 */}
              {/* <Camera size={24} className="text-primary-100 cursor-pointer" /> */}
            </div>
            {/* 선수 이미지 영역 */}
            <div className="flex flex-col items-start gap-1">
              <img
                src={playerRating.full_profile_image_url}
                alt={playerRating.korean_name}
                className="mx-auto h-[300px] w-[300px] rounded-lg object-cover"
              />
              <div className="text-left">
                <h2 className="text-primary-100 text-yds-s2">{playerRating.korean_name}</h2>
              </div>
            </div>

            {/*선수 데이터 영역 */}
            <div className="bg-background-secondary flex flex-col gap-2 rounded-lg p-4">
              <div className="text-md flex items-center justify-between font-semibold">
                <span className="text-primary-100">Goal</span>
                <span className="text-white"> {playerRating.goals}</span>
              </div>
              <div className="text-md flex items-center justify-between font-semibold">
                <span className="text-primary-100">Assist</span>
                <span className="text-white"> {playerRating.assists}</span>
              </div>
              <div className="text-md flex items-center justify-between font-semibold">
                <span className="text-primary-100">보루센 실시간 평점</span>
                <span className="text-white"> {playerRating.avg_rating} 점</span>
              </div>
            </div>

            {/* 평점 입력 영역 */}
            <RatingGaugeInput
              value={selectedRating}
              onChangeEnd={handleRatingChangeEnd} // 드래그 완료 시에만 호출
              disabled={isInserting}
            />
          </div>
        </div>
      </LayoutWithHeaderFooter>
      <div className="flex h-auto w-full items-center justify-center">
        <Button size="full" onClick={handleInsertMatchPlayerRating} isLoading={isInserting} disabled={isInserting}>
          평점 등록하기
        </Button>
      </div>
    </>
  );
};

export default MatchesLastestPlayerRating;
