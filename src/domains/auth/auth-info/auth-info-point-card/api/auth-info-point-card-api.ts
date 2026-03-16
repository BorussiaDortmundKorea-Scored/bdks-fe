import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

/** RPC get_profile_with_points 반환 타입. COALESCE로 항상 0 이상 정수 */
export type IProfilePoints = Pick<IProfileEntity, "points">;

/**
 * 포인트 카드용 보유 포인트만 조회 (RPC에서 COALESCE(points,0) 적용)
 */
export const getProfilePoints = async (
  userId: string,
): Promise<ApiResponse<IProfilePoints | null>> => {
  const { data, error } = (await supabase.rpc("get_profile_with_points", {
    p_user_id: userId,
  })) as {
    data: IProfilePoints | null;
    error: PostgrestError | null;
  };

  return {
    data: data ?? null,
    error: error as PostgrestError,
  };
};
