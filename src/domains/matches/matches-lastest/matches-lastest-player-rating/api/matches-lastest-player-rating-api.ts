// src/domains/matches/matches-lastest/matches-lastest-player-rating/api/matches-lastest-player-rating-api.ts
// types에서 import
import type {
  IGetMatchPlayerRatingRequest,
  IGetUserPlayerRatingsRequest,
  IInsertPlayerRatingRequest,
  IInsertPlayerRatingResponse,
  IMatchPlayerRating,
  IRatingUpdatedPayload,
  IUserPlayerRatings,
} from "../types";
import { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

// 특정 경기의 특정 선수 평점 조회
export const getMatchPlayerRating = async (
  request: IGetMatchPlayerRatingRequest,
): Promise<ApiResponse<IMatchPlayerRating>> => {
  const { data, error } = await supabase.rpc("get_match_single_player_rating", {
    match_id_param: request.match_id,
    player_id_param: request.player_id,
  });

  return {
    data: data as IMatchPlayerRating,
    error: error as PostgrestError,
  };
};

// 평점 입력 + broadcast 전송
export const insertPlayerRating = async (
  request: IInsertPlayerRatingRequest,
): Promise<ApiResponse<IInsertPlayerRatingResponse>> => {
  const { data, error } = await supabase.rpc("insert_player_rating", {
    p_match_id: request.match_id,
    p_player_id: request.player_id,
    p_minute: request.minute,
    p_rating: request.rating,
  });

  // 성공 시 broadcast로 다른 클라이언트들에게 알림
  if (!error && data) {
    const channelName = `match-${request.match_id}-player-${request.player_id}`;

    try {
      const payload: IRatingUpdatedPayload = {
        match_id: request.match_id,
        player_id: request.player_id,
        minute: request.minute,
        rating: request.rating,
        timestamp: new Date().toISOString(),
        action: "INSERT",
      };

      await supabase.channel(channelName).send({
        type: "broadcast",
        event: "rating_updated",
        payload,
      });
    } catch (broadcastError) {
      console.warn("브로드캐스트 전송 실패:", broadcastError);
    }
  }

  return {
    data: data as IInsertPlayerRatingResponse,
    error: error as PostgrestError,
  };
};

// 사용자의 특정 선수에 대한 모든 평점 조회
export const getUserPlayerRatings = async (
  request: IGetUserPlayerRatingsRequest,
): Promise<ApiResponse<IUserPlayerRatings>> => {
  const { data, error } = await supabase.rpc("get_user_player_ratings", {
    p_match_id: request.match_id,
    p_player_id: request.player_id,
  });

  return {
    data: data as IUserPlayerRatings,
    error: error as PostgrestError,
  };
};
