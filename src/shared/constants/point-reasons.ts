/**
 * 작성자: KYD
 * 기능: 포인트 지급/차감 사유 상수 (point_transactions.reason)
 * DB point_transactions.reason CHECK 값과 동기화 유지
 */

export const POINT_REASONS = {
  ATTENDANCE_CHECK: "ATTENDANCE_CHECK",
} as const;

export type PointReason = (typeof POINT_REASONS)[keyof typeof POINT_REASONS];
