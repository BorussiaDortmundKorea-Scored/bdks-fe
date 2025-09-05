// src/domains/matches/matches-lastest/matches-lastest-player-rating/types/api.types.ts

// API 요청/응답 타입들
export interface IGetMatchPlayerRatingRequest {
  match_id: string;
  player_id: string;
}

export interface IInsertPlayerRatingRequest {
  match_id: string;
  player_id: string;
  minute: number;
  rating: number;
  comment?: string;
}

export interface IInsertPlayerRatingResponse {
  id: string;
  rating: number;
  minute: number;
  user_nickname: string;
  success: boolean;
  message: string;
}

export interface IGetUserPlayerRatingsRequest {
  match_id: string;
  player_id: string;
}

// 브로드캐스트 페이로드 타입
export interface IRatingUpdatedPayload {
  match_id: string;
  player_id: string;
  minute: number;
  rating: number;
  timestamp: string;
  action: "INSERT" | "UPDATE" | "DELETE";
}
