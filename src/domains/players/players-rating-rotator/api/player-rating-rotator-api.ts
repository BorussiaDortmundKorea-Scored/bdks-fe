import { supabase } from "@shared/api/config/supabaseClient";
// axios가 필요없다. why? supabase rls설정 rpc를 통하여 권한체크 가능함

export interface IRotatePlayerStatAccumulated {
  korean_name: string;
  overall_avg_rating: number | null;
}

export const getRotatePlayerStatAccumulated = async () => {
  const { data, error } = await supabase.rpc("get_all_players_ratings");

  if (error) {
    throw new Error(`Failed to fetch player ratings: ${error.message}`);
  }

  return data as IRotatePlayerStatAccumulated[];
};
