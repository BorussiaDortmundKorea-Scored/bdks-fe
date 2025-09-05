// src/domains/matches/matches-lastest/matches-lastest-player-rating/components/rating-gauge-input.tsx
/**
 * 작성자: KYD
 * 기능: 게이지 바 형태의 평점 입력 컴포넌트
 * 범위: 0.0 ~ 10.0 (0.1 단위)
 */
import { useCallback, useEffect, useRef, useState } from "react";

interface RatingGaugeInputProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const RatingGaugeInput = ({ value, onChange, disabled = false, size = "md" }: RatingGaugeInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const gaugeRef = useRef<HTMLDivElement>(null);

  // 사이즈별 스타일 설정
  const sizeStyles = {
    sm: { height: "h-3", text: "text-sm", container: "py-2" },
    md: { height: "h-4", text: "text-base", container: "py-3" },
    lg: { height: "h-6", text: "text-lg", container: "py-4" },
  };

  const currentSize = sizeStyles[size];

  // 마우스/터치 위치를 평점으로 변환
  const getPositionToRating = useCallback((clientX: number): number => {
    if (!gaugeRef.current) return 0;

    const rect = gaugeRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rating = percentage * 10;

    // 0.1 단위로 반올림
    return Math.round(rating * 10) / 10;
  }, []);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      setIsDragging(true);
      const rating = getPositionToRating(e.clientX);
      setTempValue(rating);
      onChange(rating);
    },
    [disabled, getPositionToRating, onChange],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;

      const rating = getPositionToRating(e.clientX);
      setTempValue(rating);
      onChange(rating);
    },
    [isDragging, disabled, getPositionToRating, onChange],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;

      setIsDragging(true);
      const touch = e.touches[0];
      const rating = getPositionToRating(touch.clientX);
      setTempValue(rating);
      onChange(rating);
    },
    [disabled, getPositionToRating, onChange],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || disabled) return;

      const touch = e.touches[0];
      const rating = getPositionToRating(touch.clientX);
      setTempValue(rating);
      onChange(rating);
    },
    [isDragging, disabled, getPositionToRating, onChange],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 전역 마우스/터치 이벤트 리스너 등록
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // value가 변경되면 tempValue도 업데이트
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // 평점에 따른 색상 계산
  const getRatingColor = useCallback((rating: number): string => {
    if (rating <= 3) return "from-red-500 to-red-600";
    if (rating <= 5) return "from-orange-500 to-orange-600";
    if (rating <= 7) return "from-yellow-500 to-yellow-600";
    if (rating <= 8.5) return "from-green-500 to-green-600";
    return "from-blue-500 to-blue-600";
  }, []);

  // 평점에 따른 텍스트 색상
  const getTextColor = useCallback((rating: number): string => {
    if (rating <= 3) return "text-red-500";
    if (rating <= 5) return "text-orange-500";
    if (rating <= 7) return "text-yellow-500";
    if (rating <= 8.5) return "text-green-500";
    return "text-blue-500";
  }, []);

  const displayValue = isDragging ? tempValue : value;
  const fillPercentage = (displayValue / 10) * 100;

  return (
    <div className={`w-full ${currentSize.container}`}>
      {/* 평점 표시 */}
      <div className="flex justify-between items-center mb-2">
        <span className={`${currentSize.text} font-bold ${getTextColor(displayValue)}`}>{displayValue.toFixed(1)}</span>
        <span className={`${currentSize.text} text-gray-400`}>/ 10.0</span>
      </div>

      {/* 게이지 바 */}
      <div className="relative">
        {/* 배경 게이지 */}
        <div
          ref={gaugeRef}
          className={`
            w-full ${currentSize.height} bg-gray-700 rounded-full cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"}
            transition-all duration-200
          `}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* 채워진 게이지 */}
          <div
            className={`
              ${currentSize.height} rounded-full transition-all duration-200
              bg-gradient-to-r ${getRatingColor(displayValue)}
              ${isDragging ? "scale-105" : ""}
            `}
            style={{ width: `${fillPercentage}%` }}
          />

          {/* 드래그 핸들 */}
          <div
            className={`
              absolute top-1/2 w-6 h-6 bg-white rounded-full shadow-lg
              transform -translate-y-1/2 -translate-x-1/2 cursor-grab
              ${isDragging ? "cursor-grabbing scale-110" : ""}
              ${disabled ? "hidden" : ""}
              transition-all duration-200
              border-2 ${getRatingColor(displayValue)} border-opacity-50
            `}
            style={{ left: `${fillPercentage}%` }}
          />
        </div>

        {/* 스케일 마커 */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {[0, 2, 4, 6, 8, 10].map((marker) => (
            <span key={marker} className="text-center">
              {marker}
            </span>
          ))}
        </div>
      </div>

      {/* 평점 설명 */}
      <div className="mt-2 text-center">
        <span className={`text-xs ${getTextColor(displayValue)}`}>
          {displayValue <= 3 && "아쉬워요"}
          {displayValue > 3 && displayValue <= 5 && "보통이에요"}
          {displayValue > 5 && displayValue <= 7 && "좋았어요"}
          {displayValue > 7 && displayValue <= 8.5 && "훌륭해요"}
          {displayValue > 8.5 && "완벽해요"}
        </span>
      </div>
    </div>
  );
};

export default RatingGaugeInput;
