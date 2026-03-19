import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

export type IUser = Omit<IProfileEntity, "points"> & {
  email?: string | null;
  last_sign_in_at?: string | null;
};

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
