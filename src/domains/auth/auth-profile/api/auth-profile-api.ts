// src/domains/auth/auth-profile/api/auth-profile-api.ts
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

export type IProfile = IProfileEntity;

export type ICreateProfileRequest =
  Pick<IProfileEntity, "nickname"> &
  Partial<Pick<IProfileEntity, "favorite_player">>;

// 프로필 생성
export const createProfile = async (profile: ICreateProfileRequest): Promise<ApiResponse<IProfile>> => {
  const { data, error } = (await supabase.rpc("insert_auth_profile", {
    profile_nickname: profile.nickname,
    profile_favorite_player: profile.favorite_player, // 🔥 변경됨
  })) as { data: IProfile; error: PostgrestError | null };

  return {
    data: data as IProfile,
    error: error as PostgrestError,
  };
};
