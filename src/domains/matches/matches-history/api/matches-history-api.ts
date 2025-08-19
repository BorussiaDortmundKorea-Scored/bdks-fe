import { supabase } from "@shared/api/config/supabaseClient";

export interface IFinishMatchList {
  id: string;
  match_date: string;
  text_home_away: string;
  round_name: string;
  season: string;
  league_name: string;
  opponent_name: string;
}

export const getAllFinishMatchLists = async () => {
  const { data, error } = await supabase.rpc("get_all_finish_match_lists");
  if (error) {
    throw new Error(`Failed to get finish match lists: ${error.message}`);
  }
  return data as IFinishMatchList[];
};
