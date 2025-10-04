import { supabase } from "@shared/api/config/supabaseClient";

export interface IMatchesLastestPlayer {
  player_id: string; // UUID 타입
  player_name: string;
  profile_image_url: string;
  avg_rating: number; // DECIMAL(3,1) 타입
  position_sort_order: number;
  line_number: 0 | 1 | 2 | 3 | 4 | 5; // SMALLINT 타입
  position_detail_name: string;
  lineup_type: string; // VARCHAR(20) 타입
  is_captain: boolean;
  substitution_status: string; // VARCHAR(20) 타입
  substitution_partner_name: string | null;
  yellow_cards: number;
  is_sent_off: boolean;
  goals: number;
  assists: number;
  is_playing: boolean;
}

export const getLatestMatchLiveFormation = async () => {
  const { data, error } = await supabase.rpc("get_latest_match_live_formation");
  if (error) {
    throw new Error(`Failed to get latest match live formation: ${error.message}`);
  }
  return data as IMatchesLastestPlayer[];
};

export interface IMatchesLastestInformation {
  match_id: string;
  opponent_name: string;
  league_name: string;
  season: string;
  home_away: string;
  round_name: string;
  match_start_time: Date;
  second_half_start_time: Date;
}

export const getLatestMatchInformation = async () => {
  const { data, error } = await supabase.rpc("get_latest_match_information");
  if (error) {
    throw new Error(`Failed to get latest match information: ${error.message}`);
  }
  return data as IMatchesLastestInformation;
};
