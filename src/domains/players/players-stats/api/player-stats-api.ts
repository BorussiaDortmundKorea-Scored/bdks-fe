import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IPlayerStats {
  id: string;
  korean_name: string;
  full_profile_image_url: string;
}

export interface IGetPlayerStatsRequest {
  player_id: string;
}

export const getPlayerStats = async (request: IGetPlayerStatsRequest): Promise<ApiResponse<IPlayerStats>> => {
  const { data, error } = (await supabase.rpc("get_player_information", {
    player_id_param: request.player_id,
  })) as {
    data: IPlayerStats;
    error: PostgrestError | null;
  };
  return { data: data as IPlayerStats, error: error as PostgrestError };
};

