import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type IPlayerEntity } from "@shared/types/entities/player.entity";

export type IPlayerDBWithMyRatings =
  Pick<IPlayerEntity, "id" | "korean_name" | "head_profile_image_url"> & {
    overall_avg_rating_all: number | null;
    overall_avg_rating_my: number | null;
  };

export const getPlayersDbWithMyRatings = async (userId: string): Promise<ApiResponse<IPlayerDBWithMyRatings[]>> =>
  callRpc<IPlayerDBWithMyRatings[]>(() =>
    supabase.rpc("get_all_players_db_with_my_ratings", {
      user_id_param: userId,
    }),
  );
