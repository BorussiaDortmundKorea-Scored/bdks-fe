// src/domains/matches/matches-lastest/matches-lastest-player-rating/api/matches-lastest-player-rating-api.ts
import { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IMatchPlayerRating {
  korean_name: string;
  head_profile_image_url: string;
  position_detail_name: string;
  line_number: number;
  avg_rating: number;
  rating_count: number;
  lineup_type: string;
  player_id: string;
  match_id: string;
}

export interface IGetMatchPlayerRatingRequest {
  match_id: string;
  player_id: string;
}

export interface IInsertPlayerRatingRequest {
  match_id: string;
  player_id: string;
  minute: number;
  rating: number;
}

export interface IInsertPlayerRatingResponse {
  id: string;
  rating: number;
  minute: number;
  user_nickname: string;
  success: boolean;
  message: string;
}

export interface IUserRating {
  id: string;
  minute: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

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
  console.log("📝 평점 입력 시작:", request);

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
      console.log("📢 브로드캐스트 전송 시작:", channelName);

      await supabase.channel(channelName).send({
        type: "broadcast",
        event: "rating_updated",
        payload: {
          match_id: request.match_id,
          player_id: request.player_id,
          minute: request.minute,
          rating: request.rating,
          timestamp: new Date().toISOString(),
          action: "INSERT",
        },
      });

      console.log("✅ 브로드캐스트 전송 완료");
    } catch (broadcastError) {
      console.warn("⚠️ 브로드캐스트 전송 실패:", broadcastError);
    }
  }

  return {
    data: data as IInsertPlayerRatingResponse,
    error: error as PostgrestError,
  };
};
