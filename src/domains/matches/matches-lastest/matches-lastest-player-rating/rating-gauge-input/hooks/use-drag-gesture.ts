/**
 * 작성자: KYD
 * 기능: 드래그 제스처 관리 커스텀 훅
 * 프로세스 설명: 마우스와 터치 이벤트를 통합 처리하여 중복 제거
 */
import { useCallback, useState } from "react";

interface UseDragGestureReturn {
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export const useDragGesture = (
  onMove: (clientX: number) => void,
  onEnd: () => void,
  disabled: boolean,
): UseDragGestureReturn => {
  const [isDragging, setIsDragging] = useState(false);

  const startDrag = useCallback(
    (clientX: number) => {
      if (disabled) return;

      setIsDragging(true);
      onMove(clientX);

      const handleMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        onMove(x);
      };

      const handleEnd = () => {
        setIsDragging(false);
        onEnd();
        document.removeEventListener("mousemove", handleMove as EventListener);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove as EventListener);
        document.removeEventListener("touchend", handleEnd);
      };

      document.addEventListener("mousemove", handleMove as EventListener);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove as EventListener, { passive: false });
      document.addEventListener("touchend", handleEnd);
    },
    [disabled, onMove, onEnd],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX);
    },
    [startDrag],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      startDrag(e.touches[0].clientX);
    },
    [startDrag],
  );

  return { isDragging, handleMouseDown, handleTouchStart };
};
