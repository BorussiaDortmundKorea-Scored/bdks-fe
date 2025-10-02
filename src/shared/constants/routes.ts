/**
 * 작성자: KYD
 * 기능: 보돌코 스코어드 라우트 상수 정의
 * 프로세스 설명: 모든 라우트 경로를 중앙 집중식으로 관리하여 타입 안전성과 유지보수성 향상시키기
 */

// 기본 라우트 상수
export const ROUTES = {
  // 퍼블릭 라우트
  LOGIN: "/",

  // 인증 프로필
  AUTH_PROFILE: "/auth/profile",

  // 메인
  DASHBOARD: "/dashboard",

  // 선수 관련
  PLAYER_RATING: "/player/:playerId/rating",
  PLAYER_STATS: "/player/:playerId/stats",

  // 경기 관련
  MATCH_RATINGS: "/match/:matchId/ratings",
  MATCH_PLAYER_RATINGS: "/match/:matchId/player/:playerId/ratings",

  // 관리자
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USER: "/admin/user",
  ADMIN_PLAYER: "/admin/player",
  ADMIN_MATCH: "/admin/match",
  ADMIN_MATCH_LINEUP: "/admin/match/:matchId/lineup",
  ADMIN_TEAM: "/admin/team",
  ADMIN_COMPETITION: "/admin/competition",
} as const;

// 동적 라우트 생성 함수들
export const createPlayerRatingPath = (playerId: string) => `/player/${playerId}/rating`;
export const createPlayerStatsPath = (playerId: string) => `/player/${playerId}/stats`;
export const createMatchRatingsPath = (matchId: string) => `/match/${matchId}/ratings`;
export const createMatchPlayerRatingsPath = (matchId: string, playerId: string) =>
  `/match/${matchId}/player/${playerId}/ratings`;
export const createAdminMatchLineupPath = (matchId: string) => `/admin/match/${matchId}/lineup`;

// 타입 정의
export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
