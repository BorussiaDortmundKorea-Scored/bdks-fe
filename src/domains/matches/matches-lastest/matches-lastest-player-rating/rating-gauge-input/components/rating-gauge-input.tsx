/**
 * 작성자: KYD
 * 기능: 드래그 가능한 평점 입력 게이지 컴포넌트
 * 프로세스 설명: 드래그 중에는 내부 상태로 즉각 반응, 드래그 완료 시에만 부모에 전달
 */
import { useCallback, useEffect, useRef, useState } from "react";

import {
  RATING_MAX,
  RATING_MIN,
  RATING_STEP,
} from "@matches/matches-lastest/matches-lastest-player-rating/rating-gauge-input/constants/rating-gauge-constants";
import { useDragGesture } from "@matches/matches-lastest/matches-lastest-player-rating/rating-gauge-input/hooks/use-drag-gesture";
import { calculateRatingFromPosition } from "@matches/matches-lastest/matches-lastest-player-rating/rating-gauge-input/utils/calculate-rating-from-position";

interface RatingGaugeInputProps {
  value: number;
  onChangeEnd: (rating: number) => void;
  disabled: boolean;
}

const RatingGaugeInput = ({ value: externalValue, onChangeEnd, disabled }: RatingGaugeInputProps) => {
  const gaugeRef = useRef<HTMLDivElement>(null);

  // 드래그 중 실시간 표시 값 (부모에 즉시 전달하지 않음)
  const [dragValue, setDragValue] = useState<number | null>(null);

  // 드래그 중 변경된 최신 값을 추적 (클로저 문제 해결용)
  const latestDragValueRef = useRef<number | null>(null);

  useEffect(() => {
    latestDragValueRef.current = dragValue;
  }, [dragValue]);

  // 위치를 평점으로 변환하는 헬퍼
  const getRatingFromClientX = useCallback(
    (clientX: number): number => {
      if (!gaugeRef.current) return externalValue;

      return calculateRatingFromPosition(clientX, gaugeRef.current, RATING_MIN, RATING_MAX, RATING_STEP);
    },
    [externalValue],
  );

  // 드래그 중 값 업데이트
  const handleDragMove = useCallback(
    (clientX: number) => {
      const newRating = getRatingFromClientX(clientX);
      setDragValue(newRating);
    },
    [getRatingFromClientX],
  );

  // 드래그 종료 시 부모에 전달
  const handleDragEnd = useCallback(() => {
    const finalValue = latestDragValueRef.current;

    if (finalValue !== null) {
      onChangeEnd(finalValue);
    }

    setDragValue(null);
  }, [onChangeEnd]);

  const { isDragging, handleMouseDown, handleTouchStart } = useDragGesture(handleDragMove, handleDragEnd, disabled);

  // 클릭 시 즉시 값 변경
  const handleGaugeClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isDragging) return;

      const newRating = getRatingFromClientX(e.clientX);
      onChangeEnd(newRating);
    },
    [disabled, isDragging, getRatingFromClientX, onChangeEnd],
  );

  // 표시 값: 드래그 중이면 드래그 값, 아니면 외부 값
  const displayValue = dragValue !== null ? dragValue : externalValue;
  const gaugePercentage = ((displayValue - RATING_MIN) / (RATING_MAX - RATING_MIN)) * 100;

  return (
    <div className="bg-background-secondary flex flex-col gap-3 rounded-lg p-4 font-semibold">
      <div className="flex items-center justify-between">
        <h3 className="text-primary-100 text-lg">평점 입력하기</h3>
        <span className="text-primary-400 text-xl font-bold">{displayValue.toFixed(1)}</span>
      </div>

      {/* 드래그 가능한 게이지 */}
      <div className="py-2">
        <div
          ref={gaugeRef}
          className={`relative h-2 w-full rounded-full bg-gray-600 transition-opacity select-none ${
            disabled ? "cursor-not-allowed opacity-50" : isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onClick={handleGaugeClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* 활성화된 게이지 */}
          <div
            className="bg-primary-400 absolute top-0 left-0 h-full rounded-full transition-all duration-100"
            style={{ width: `${gaugePercentage}%` }}
          />

          {/* 드래그 핸들 */}
          <div
            className={`bg-primary-400 absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-all duration-100 ${
              isDragging ? "scale-110 shadow-lg" : "scale-100"
            }`}
            style={{ left: `${gaugePercentage}%` }}
          />
        </div>
      </div>

      {/* min-max 라벨 */}
      <div className="text-primary-100 flex items-center justify-between text-sm">
        <span>{RATING_MIN.toFixed(1)}</span>
        <span>{(RATING_MIN + (RATING_MAX - RATING_MIN) * 0.5).toFixed(1)}</span>
        <span>{RATING_MAX.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default RatingGaugeInput;
