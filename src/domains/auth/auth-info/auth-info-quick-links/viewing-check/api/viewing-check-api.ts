import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export type ViewingMatchStatus = "PAST" | "TODAY";

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
  /** 지난 경기 관람체크 여부. true: 관람완료, false: 미관람 */
  has_viewing_check: boolean;
}

export const getViewingMatches = async (): Promise<ApiResponse<IViewingMatch[]>> => {
  const { data, error } = (await supabase.rpc("get_viewing_matches")) as {
    data: IViewingMatch[];
    error: PostgrestError | null;
  };

  return { data: data as IViewingMatch[], error: error as PostgrestError };
};
