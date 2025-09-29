import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IMatchesHistoryPlayersRating {
  korean_name: string;
  head_profile_image_url: string;
  position_detail_name: string;
  line_number: number;
  avg_rating: number;
  rating_count: number;
  lineup_type: string;
  goals: number;
  assists: number;
  substitution_status: "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT";
  substitution_minute: number | null;
  yellow_cards: number;
  red_card_minute: number | null;
  is_sent_off: number | null;
  botm: boolean;
}

export interface IMatchInfo {
  home_away: "HOME" | "AWAY";
  our_score: number;
  opponent_score: number;
  competition_name: string;
  season: string;
  opponent_team_name: string;
}

export const getMatchesHistoryPlayersRating = async (
  matchId: string,
): Promise<ApiResponse<IMatchesHistoryPlayersRating[]>> => {
  const { data, error } = (await supabase.rpc("get_matches_player_ratings", {
    match_id_param: matchId,
  })) as {
    data: IMatchesHistoryPlayersRating[];
    error: PostgrestError | null;
  };
  return { data: data as IMatchesHistoryPlayersRating[], error: error as PostgrestError };
};

export const getMatchInfo = async (matchId: string): Promise<ApiResponse<IMatchInfo>> => {
  const { data, error } = (await supabase.rpc("get_match_info", {
    match_id_param: matchId,
  })) as {
    data: IMatchInfo;
    error: PostgrestError | null;
  };
  return { data: data as IMatchInfo, error: error as PostgrestError };
};
