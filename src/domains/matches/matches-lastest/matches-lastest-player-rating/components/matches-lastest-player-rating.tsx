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
import RatingGaugeInput from "./rating-gauge-input";
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
          <div className="flex flex-col gap-6">
            {/* 선수 정보 */}
            <div className="flex flex-col items-center gap-4">
              <img
                src={playerRating?.full_profile_image_url}
                alt={playerRating?.korean_name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary-400"
              />
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary-100">{playerRating?.korean_name}</h2>
                <p className="text-gray-300">{playerRating?.position_detail_name}</p>
              </div>
            </div>

            {/* 실시간 평점 정보 */}
            <div className="bg-background-secondary rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-400">
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

            {/* 평점 입력 섹션 */}
            <div className="bg-background-secondary rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">평점 입력하기</h3>

              {/* 게이지 바 평점 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">평점 선택</label>
                <RatingGaugeInput
                  value={selectedRating}
                  onChange={handleRatingChange}
                  size="lg"
                  disabled={isInserting}
                />
              </div>

              {/* 시간 입력 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">경기 시간 (분)</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={minute}
                  onChange={handleMinuteChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary-400"
                  placeholder="1-90분"
                  disabled={isInserting}
                />
              </div>

              {/* 코멘트 입력 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">코멘트 (선택사항)</label>
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-primary-400 resize-none"
                  placeholder="플레이에 대한 코멘트를 남겨주세요..."
                  rows={3}
                  maxLength={200}
                  disabled={isInserting}
                />
                <p className="text-xs text-gray-400 mt-1">{comment.length}/200</p>
              </div>
            </div>
          </div>
        </div>
      </LayoutWithHeaderFooter>
      <div className="w-full h-auto flex justify-center items-center">
        <Button size="full" onClick={handleInsertMatchPlayerRating} isLoading={isInserting} disabled={isInserting}>
          평점 입력하기
        </Button>
      </div>
    </>
  );
};

export default MatchesLastestPlayerRating;
