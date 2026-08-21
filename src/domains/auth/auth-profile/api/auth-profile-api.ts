// src/domains/auth/auth-profile/api/auth-profile-api.ts
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

export type IProfile = IProfileEntity;

export type ICreateProfileRequest =
  Pick<IProfileEntity, "nickname"> &
  Partial<Pick<IProfileEntity, "favorite_player">>;

// 프로필 생성
export const createProfile = async (profile: ICreateProfileRequest): Promise<ApiResponse<IProfile>> =>
  callRpc<IProfile>(() =>
    supabase.rpc("insert_auth_profile", {
      profile_nickname: profile.nickname,
      profile_favorite_player: profile.favorite_player, // 🔥 변경됨
    }),
  );
