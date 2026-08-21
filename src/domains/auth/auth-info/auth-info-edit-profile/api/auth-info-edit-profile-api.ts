import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

export type IUpdateProfileRequest = Pick<IProfileEntity, "nickname"> &
  Partial<Pick<IProfileEntity, "favorite_player">>;

export const updateProfile = async (
  userId: string,
  profile: IUpdateProfileRequest,
): Promise<ApiResponse<IProfileEntity>> =>
  callRpc<IProfileEntity>(() =>
    supabase.rpc("update_profile", {
      p_user_id: userId,
      p_nickname: profile.nickname,
      p_favorite_player: profile.favorite_player ?? null,
    }),
  );
