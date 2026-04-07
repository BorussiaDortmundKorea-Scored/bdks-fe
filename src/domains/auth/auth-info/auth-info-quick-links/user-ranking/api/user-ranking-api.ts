import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IUserRankingBase {
  rank: number;
  user_id: string;
  nickname: string;
  favorite_player_image_url: string | null;
}

export interface IUserRatingRanking extends IUserRankingBase {
  rating_count: number;
}

export interface IUserViewingRanking extends IUserRankingBase {
  viewing_count: number;
}

export const getUserRatingRanking = async (): Promise<ApiResponse<IUserRatingRanking[]>> => {
  const { data, error } = (await supabase.rpc("get_user_rating_ranking")) as {
    data: IUserRatingRanking[];
    error: PostgrestError | null;
  };

  return { data: (data ?? []) as IUserRatingRanking[], error: error as PostgrestError };
};

export const getUserViewingRanking = async (): Promise<ApiResponse<IUserViewingRanking[]>> => {
  const { data, error } = (await supabase.rpc("get_user_viewing_ranking")) as {
    data: IUserViewingRanking[];
    error: PostgrestError | null;
  };

  return { data: (data ?? []) as IUserViewingRanking[], error: error as PostgrestError };
};
