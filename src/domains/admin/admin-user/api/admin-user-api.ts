import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

export type IUser = Omit<IProfileEntity, "points"> & {
  email?: string | null;
  /** 최근 활동일: 로그인/세션갱신(auth.updated_at)/평점입력 중 가장 최신 시각 (RPC get_all_users) */
  last_sign_in_at?: string | null;
};

export interface IDeleteUserResponse {
  success: boolean;
  error?: string;
  message?: string;
}

// 모든 사용자 조회 (profiles + auth.users 조인)
export const getAllUsers = async (): Promise<ApiResponse<IUser[]>> =>
  callRpc<IUser[]>(() => supabase.rpc("get_all_users"));

// 사용자 강제 탈퇴 (관리자 전용)
export const deleteUserByAdmin = async (userId: string): Promise<ApiResponse<IDeleteUserResponse>> =>
  callRpc<IDeleteUserResponse>(() =>
    supabase.rpc("delete_user_by_admin", {
      target_user_id: userId,
    }),
  );
