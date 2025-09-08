// src/domains/matches/matches-lastest/matches-lastest-player-rating/components/rating-input-gauge.tsx
/**
 * 작성자: KYD
 * 기능: 드래그 가능한 평점 입력 게이지 컴포넌트
 * 프로세스 설명: 0.0~10.0 범위에서 0.1 단위로 평점 입력 가능
 */
import { useRef, useState } from "react";

interface RatingGaugeInputProps {
  value: number;
  onChange: (rating: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const RatingGaugeInput = ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
  disabled = false,
}: RatingGaugeInputProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // 게이지 컨테이너 REF
  const gaugeRef = useRef<HTMLDivElement>(null);

  // 마우스/터치 위치를 기반으로 평점 계산
  const calculateRatingFromEvent = (clientX: number) => {
    if (!gaugeRef.current || disabled) return value;

    const rect = gaugeRef.current.getBoundingClientRect();
    const x = clientX - rect.left; // 상대적 x 위치
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100)); // 0-100% 사이로 제한
    const rating = (percentage / 100) * (max - min) + min; // min-max 범위로 변환

    // step 단위로 반올림
    const steppedRating = Math.round(rating / step) * step;
    return Math.max(min, Math.min(max, steppedRating)); // min-max 사이로 제한
  };

  // 게이지 클릭 핸들러
  const handleGaugeClick = (e: React.MouseEvent) => {
    if (disabled) return;

    const newRating = calculateRatingFromEvent(e.clientX);
    onChange(newRating);
  };

  // 마우스 다운 핸들러 (드래그 시작)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);
    const newRating = calculateRatingFromEvent(e.clientX);
    onChange(newRating);

    // 전역 마우스 이벤트 리스너 등록
    const handleMouseMove = (e: MouseEvent) => {
      const newRating = calculateRatingFromEvent(e.clientX);
      onChange(newRating);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 터치 시작 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;

    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    const newRating = calculateRatingFromEvent(touch.clientX);
    onChange(newRating);

    // 전역 터치 이벤트 리스너 등록
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // 스크롤 방지
      const touch = e.touches[0];
      const newRating = calculateRatingFromEvent(touch.clientX);
      onChange(newRating);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  // 게이지 위치 계산 (0-100%)
  const gaugePercentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="bg-background-secondary flex flex-col gap-3 rounded-lg p-4 font-semibold">
      <div className="flex items-center justify-between">
        <h3 className="text-primary-100 text-lg">평점 입력하기</h3>
        <span className="text-primary-400 text-xl font-bold">{value.toFixed(1)}</span>
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
            className={`bg-primary-400 absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-all duration-100 ${
              isDragging ? "scale-110" : "scale-100"
            }`}
            style={{ left: `${gaugePercentage}%` }}
          />
        </div>
      </div>

      {/* min-max 라벨 */}
      <div className="text-primary-100 flex items-center justify-between text-sm">
        <span>{min.toFixed(1)}</span>
        <span>{(min + (max - min) * 0.25).toFixed(1)}</span>
        <span>{(min + (max - min) * 0.5).toFixed(1)}</span>
        <span>{(min + (max - min) * 0.75).toFixed(1)}</span>
        <span>{max.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default RatingGaugeInput;
