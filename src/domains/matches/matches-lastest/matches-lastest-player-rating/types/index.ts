// 배럴 익스포트로 편리한 import 제공
export type { IMatchPlayerRating, IUserRating, IUserPlayerRatings } from "./match-player-rating.types";

export type {
  IGetMatchPlayerRatingRequest,
  IInsertPlayerRatingRequest,
  IInsertPlayerRatingResponse,
  IGetUserPlayerRatingsRequest,
  IRatingUpdatedPayload,
} from "./api.types";

// 유틸리티 타입들
export type MatchId = string;
export type PlayerId = string;
export type RatingValue = number; // 1-10
export type MinuteValue = number; // 1-120
