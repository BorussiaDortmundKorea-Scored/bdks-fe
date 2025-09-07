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
// types에서 import
import type { IInsertPlayerRatingRequest } from "../types";
import { Button } from "@youngduck/yd-ui";

import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

const MatchesLastestPlayerRating = () => {
  //SECTION HOOK호출 영역
  const { matchId, playerId } = useParams();
  const [selectedRating, setSelectedRating] = useState<number>(5.0);
  const [minute, setMinute] = useState<number>(45);
  const [comment, setComment] = useState<string>("");

  // broadcast 방식 실시간 구독이 포함된 훅 사용
  const { data: playerRating } = useRealtimeMatchPlayerRating({
    matchId: matchId!,
    playerId: playerId!,
  });

  const { mutateAsync: insertMatchPlayerRating, isPending: isInserting } = useInsertMatchPlayerRating();
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 90) {
      setMinute(value);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleInsertMatchPlayerRating = async () => {
    try {
      const request: IInsertPlayerRatingRequest = {
        match_id: matchId!,
        player_id: playerId!,
        minute: minute,
        rating: selectedRating,
        comment: comment.trim() || undefined,
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
        <div className="w-full h-auto py-6">
          <div className="flex flex-col gap-3">
            {/* 선수 이미지 영역 */}
            <div className="flex flex-col items-start gap-3">
              <img
                src={playerRating.full_profile_image_url}
                alt={playerRating.korean_name}
                className="w-[300px] h-[300px] object-cover mx-auto"
              />
              <h2 className="text-2xl font-bold text-primary-100">{playerRating.korean_name}</h2>
            </div>

            {/*선수 데이터 영역 */}
            <div className="bg-background-secondary rounded-lg p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-md font-semibold">
                <span className="text-primary-100">Goal</span>
                <span className="text-white"> {playerRating.avg_rating}</span>
              </div>
              <div className="flex justify-between items-center text-md font-semibold">
                <span className="text-primary-100">Assist</span>
                <span className="text-white"> {playerRating.avg_rating}</span>
              </div>
              <div className="flex justify-between items-center text-md font-semibold">
                <span className="text-primary-100">보루센 실시간 평점</span>
                <span className="text-white"> {playerRating.avg_rating} 점</span>
              </div>
            </div>

            {/* 평점 입력 영역 */}
            <div className="bg-background-secondary rounded-lg p-4 flex flex-col gap-2 font-semibold">
              <h3 className="text-lg  text-primary-100 ">평점 입력하기</h3>
              <div>
                <div className="relative w-full h-2 bg-white rounded-full" onClick={() => handleRatingChange(1)}>
                  {/* 게이지 */}
                  <div
                    className="absolute top-0 left-0 h-full bg-primary-400 rounded-full"
                    style={{ width: `${selectedRating * 10}%` }}
                  ></div>
                  {/* 원 */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2  bg-primary-400 rounded-full w-5 h-5"
                    style={{ left: `calc(${selectedRating * 10}% - 10px)` }}
                  ></div>
                </div>
              </div>
              <div className="flex text-primary-100 justify-between items-center">
                <span>0</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
      </LayoutWithHeaderFooter>
      <div className="w-full h-auto flex justify-center items-center">
        <Button size="full" onClick={handleInsertMatchPlayerRating} isLoading={isInserting} disabled={isInserting}>
          평점 등록하기
        </Button>
      </div>
    </>
  );
};

export default MatchesLastestPlayerRating;
