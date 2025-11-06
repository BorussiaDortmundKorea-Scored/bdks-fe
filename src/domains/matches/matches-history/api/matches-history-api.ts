import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IFinishMatchList {
  id: string;
  match_date: string;
  text_home_away: "HOME" | "AWAY";
  round_name: string;
  season: string;
  league_name: string;
  opponent_name: string;
}

export const getAllFinishMatchLists = async (): Promise<ApiResponse<IFinishMatchList[]>> => {
  const { data, error } = (await supabase.rpc("get_all_finish_match_lists")) as {
    data: IFinishMatchList[];
    error: PostgrestError | null;
  };
  return { data: data as IFinishMatchList[], error: error as PostgrestError };
};
