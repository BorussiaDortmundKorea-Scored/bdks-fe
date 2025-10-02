import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IUser {
  id: string;
  nickname: string;
  favorite_player: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
  email?: string | null;
  last_sign_in_at?: string | null;
}

export interface IDeleteUserResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// 모든 사용자 조회 (profiles + auth.users 조인)
export const getAllUsers = async (): Promise<ApiResponse<IUser[]>> => {
  const { data, error } = (await supabase.rpc("get_all_users")) as { data: IUser[]; error: PostgrestError | null };
  return { data: data as IUser[], error: error as PostgrestError };
};

// 사용자 강제 탈퇴 (관리자 전용)
export const deleteUserByAdmin = async (userId: string): Promise<ApiResponse<IDeleteUserResponse>> => {
  const { data, error } = (await supabase.rpc("delete_user_by_admin", {
    target_user_id: userId,
  })) as { data: IDeleteUserResponse; error: PostgrestError | null };

  return {
    data: data as IDeleteUserResponse,
    error: error as PostgrestError,
  };
};
