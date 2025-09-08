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
    const payload: IRatingUpdatedPayload = {
      match_id: request.match_id,
      player_id: request.player_id,
      minute: request.minute,
      rating: request.rating,
      timestamp: new Date().toISOString(),
      action: "INSERT",
    };

    try {
      // 🎯 1. 개별 선수 채널 (기존 - 개별 선수 화면용)
      const playerChannelName = `match-${request.match_id}-player-${request.player_id}`;
      const playerResult = await supabase.channel(playerChannelName).send({
        type: "broadcast",
        event: "rating_updated",
        payload,
      });
      console.log("📢 개별 선수 브로드캐스트:", playerChannelName, playerResult);

      // 🎯 2. 전체 경기 채널 (새로 추가 - 전체 선수 목록용)
      const allPlayersChannelName = `match-${request.match_id}-all-players`;
      const allPlayersResult = await supabase.channel(allPlayersChannelName).send({
        type: "broadcast",
        event: "player_rating_updated", // 이벤트명 다르게 설정
        payload,
      });
      console.log("📢 전체 선수 브로드캐스트:", allPlayersChannelName, allPlayersResult);
    } catch (broadcastError) {
      console.error("❌ 브로드캐스트 전송 실패:", broadcastError);
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
