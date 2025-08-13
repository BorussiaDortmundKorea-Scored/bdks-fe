import { supabase } from "@shared/api/config/supabaseClient";

export interface IPlayerDBWithMyRatings {
  id: string;
  korean_name: string;
  head_profile_image_url: string;
  overall_avg_rating_all: number | null;
  overall_avg_rating_my: number | null;
}

export const getPlayerDBWithMyRatings = async (userId: string) => {
  const { data, error } = await supabase.rpc("get_all_players_db_with_my_ratings", {
    user_id_param: userId,
  });
  if (error) {
    throw new Error(`Failed to get player db with my ratings: ${error.message}`);
  }
  return data as IPlayerDBWithMyRatings[];
};
