import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type LineupType } from "@shared/types/match-lineup.types";
import { type HomeAway } from "@shared/types/match.types";

export interface IMatchesHistoryPlayersRating {
  player_id: string;
  korean_name: string;
  head_profile_image_url: string;
  position_detail_name: string;
  line_number: number;
  /** 같은 라인 안에서의 좌→우 순서 (positions.sort_order) */
  position_sort_order: number;
  /**
   * 경기 종료 시점에 그라운드에 있던 선수인지 여부.
   * `(선발 or 교체 투입) and 교체 아웃 안 됨` — 종료된 경기에서도 정확히 11명이라 포메이션이 성립한다.
   */
  is_playing: boolean;
  avg_rating: number;
  rating_count: number;
  lineup_type: LineupType;
  is_captain: boolean;
  goals: number;
  assists: number;
  sub_in_minute: number | null;
  sub_out_minute: number | null;
  yellow_cards: number;
  red_card_minute: number | null;
  is_sent_off: boolean;
  botm: boolean;
}

export interface IMatchInfo {
  home_away: HomeAway;
  our_score: number;
  opponent_score: number;
  competition_name: string;
  season: string;
  opponent_team_name: string;
}

export const getMatchesHistoryPlayersRating = async (
  matchId: string,
): Promise<ApiResponse<IMatchesHistoryPlayersRating[]>> =>
  callRpc<IMatchesHistoryPlayersRating[]>(() =>
    supabase.rpc("get_matches_player_ratings", {
      match_id_param: matchId,
    }),
  );

export const getMatchInfo = async (matchId: string): Promise<ApiResponse<IMatchInfo>> =>
  callRpc<IMatchInfo>(() =>
    supabase.rpc("get_match_info", {
      match_id_param: matchId,
    }),
  );
