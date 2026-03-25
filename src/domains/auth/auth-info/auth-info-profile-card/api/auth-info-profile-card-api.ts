import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";

/** RPC get_profile_summary 반환 타입. points + favorite_player 이미지 URL */
export interface IProfileSummary extends Pick<IProfileEntity, "points"> {
  favorite_player_image_url: string | null;
}

/**
 * 프로필 카드용 요약 정보 조회 (포인트 + 좋아하는 선수 이미지)
 */
export const getProfileSummary = async (
  userId: string,
): Promise<ApiResponse<IProfileSummary | null>> => {
  const { data, error } = (await supabase.rpc("get_profile_summary", {
    p_user_id: userId,
  })) as {
    data: IProfileSummary | null;
    error: PostgrestError | null;
  };

  return {
    data: data ?? null,
    error: error as PostgrestError,
  };
};
