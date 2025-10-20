/**
 * 작성자: KYD
 * 기능: 클릭/드래그 위치를 평점 값으로 변환하는 유틸 함수
 * 프로세스 설명: 요소 내 상대 위치를 백분율로 변환하고, 지정된 범위와 단계에 맞춰 반올림
 */

/**
 * 클릭/드래그 위치를 평점 값으로 변환
 *
 * @param clientX - 마우스/터치의 X 좌표
 * @param element - 게이지 요소
 * @param min - 최소 평점
 * @param max - 최대 평점
 * @param step - 평점 단계 (예: 0.1)
 * @returns 계산된 평점 값
 */
export const calculateRatingFromPosition = (
  clientX: number,
  element: HTMLDivElement,
  min: number,
  max: number,
  step: number,
): number => {
  const rect = element.getBoundingClientRect();
  const relativeX = clientX - rect.left;
  const percentage = Math.max(0, Math.min(1, relativeX / rect.width));
  const rawRating = percentage * (max - min) + min;
  const steppedRating = Math.round(rawRating / step) * step;

  return Math.max(min, Math.min(max, steppedRating));
};
