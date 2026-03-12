import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export type ViewingMatchStatus = "PAST" | "TODAY" | "UPCOMING";

export interface IViewingMatch {
  id: string;
  match_date: string;
  home_away: "HOME" | "AWAY";
  round_name: string | null;
  competition_name: string;
  season: string;
  opponent_team_name: string;
  opponent_team_logo_image_url: string | null;
  is_live: boolean;
  status: ViewingMatchStatus;
}

export const getViewingMatches = async (): Promise<ApiResponse<IViewingMatch[]>> => {
  const { data, error } = (await supabase.rpc("get_viewing_matches")) as {
    data: IViewingMatch[];
    error: PostgrestError | null;
  };

  return { data: data as IViewingMatch[], error: error as PostgrestError };
};
