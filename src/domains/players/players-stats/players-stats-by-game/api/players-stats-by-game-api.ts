import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IPlayerStatsByGame {
  id: string;
  match_date: string;
  text_home_away: string;
  round_name: string | null;
  season: string;
  league_name: string;
  opponent_name: string;
  goals: number;
  assists: number;
  avg_rating: number;
  rating_count: number;
}

export interface IGetPlayerStatsByGameRequest {
  player_id: string;
}

export const getPlayerStatsByGame = async (
  request: IGetPlayerStatsByGameRequest,
): Promise<ApiResponse<IPlayerStatsByGame[]>> =>
  callRpc<IPlayerStatsByGame[]>(() =>
    supabase.rpc("get_player_stats_by_game", {
      player_id_param: request.player_id,
    }),
  );

