import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IPlayerDBWithMyRatings {
  id: string;
  korean_name: string;
  head_profile_image_url: string;
  overall_avg_rating_all: number | null;
  overall_avg_rating_my: number | null;
}

export const getPlayersDbWithMyRatings = async (userId: string): Promise<ApiResponse<IPlayerDBWithMyRatings[]>> => {
  const { data, error } = (await supabase.rpc("get_all_players_db_with_my_ratings", {
    user_id_param: userId,
  })) as {
    data: IPlayerDBWithMyRatings[];
    error: PostgrestError | null;
  };
  return { data: data as IPlayerDBWithMyRatings[], error: error as PostgrestError };
};
