/**
 * 작성자: KYD
 * 기능: 경기 평점 현황(참여율 + 입력 갯수) 통합 조회 API (RPC 사용)
 * 프로세스 설명: get_match_overview RPC 하나로 경기별 유니크 유저수/총 평점수/회원수/참여율(%)을 한 번에 조회해
 *              PagedCard 의 두 페이지(참여율 / 입력 현황)에서 함께 사용한다.
 */
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IMatchOverviewItem {
  match_id: string;
  match_name: string;
  opponent_name: string;
  match_date: string;
  unique_user_count: number;
  total_rating_count: number;
  total_users: number;
  coverage_percent: number;
}

export const getMatchOverview = async (limitCount = 10): Promise<ApiResponse<IMatchOverviewItem[]>> => {
  const { data, error } = await supabase.rpc("get_match_overview", { limit_count: limitCount });

  if (error) throw error;

  return {
    data: (data ?? []) as IMatchOverviewItem[],
    error: error as unknown as PostgrestError,
  };
};
