/**
 * 작성자: KYD
 * 기능: GA4 이벤트/카테고리/라벨 상수 정의
 * 프로세스 설명: 분석 스키마를 중앙에서 관리하여 오타 및 불일치 방지
 */

export const GA4_EVENTS = {
  LOGIN_ATTEMPT: "login_attempt",
} as const;

export const GA4_CATEGORIES = {
  AUTH: "auth",
} as const;

export const GA4_LOGIN_METHODS = {
  KAKAO: "kakao",
  ANONYMOUS: "anonymous",
} as const;

