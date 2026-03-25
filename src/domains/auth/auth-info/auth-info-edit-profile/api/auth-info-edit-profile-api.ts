import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

export type IUpdateProfileRequest = Pick<IProfileEntity, "nickname"> &
  Partial<Pick<IProfileEntity, "favorite_player">>;

export const updateProfile = async (
  userId: string,
  profile: IUpdateProfileRequest,
): Promise<ApiResponse<IProfileEntity>> => {
  const { data, error } = (await supabase.rpc("update_profile", {
    p_user_id: userId,
    p_nickname: profile.nickname,
    p_favorite_player: profile.favorite_player ?? null,
  })) as { data: IProfileEntity; error: PostgrestError | null };

  return {
    data: data as IProfileEntity,
    error: error as PostgrestError,
  };
};
