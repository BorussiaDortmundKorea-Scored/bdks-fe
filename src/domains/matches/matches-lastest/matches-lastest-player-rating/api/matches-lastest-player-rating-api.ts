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

// 특정 경기의 특정 선수 평점 조회
export const getMatchPlayerRating = async (
  request: IGetMatchPlayerRatingRequest,
): Promise<ApiResponse<IMatchPlayerRating>> => {
  const { data, error } = await supabase.rpc("get_match_single_player_rating", {
    match_id_param: request.match_id,
    player_id_param: request.player_id,
  });

  return {
    data: data as IMatchPlayerRating, // JSON 객체를 타입으로 캐스팅
    error: error as PostgrestError,
  };
};
