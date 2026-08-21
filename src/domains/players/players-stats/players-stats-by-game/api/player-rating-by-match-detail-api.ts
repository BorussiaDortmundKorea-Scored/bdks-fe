import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IPlayerRatingByMatchDetail {
  minute: string;
  avg_rating: number;
  rating_count: number;
}

export interface IPlayerRatingByMatchDetailResponse {
  my_ratings: IPlayerRatingByMatchDetail[];
  other_ratings: IPlayerRatingByMatchDetail[];
}

export interface IGetPlayerRatingByMatchDetailRequest {
  match_id: string;
  player_id: string;
  user_id: string;
}

export const getPlayerRatingByMatchDetail = async (
  request: IGetPlayerRatingByMatchDetailRequest,
): Promise<ApiResponse<IPlayerRatingByMatchDetailResponse>> =>
  callRpc<IPlayerRatingByMatchDetailResponse>(() =>
    supabase.rpc("get_player_rating_by_match_detail", {
      match_id_param: request.match_id,
      player_id_param: request.player_id,
      user_id_param: request.user_id,
    }),
  );
