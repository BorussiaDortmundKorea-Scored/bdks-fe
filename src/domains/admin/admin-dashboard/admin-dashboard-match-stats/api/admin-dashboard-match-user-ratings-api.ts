/**
 * 작성자: KYD
 * 기능: 특정 경기에서 유저별 평점 입력 횟수 조회 API (RPC 사용)
 * 프로세스 설명: 평점 입력 현황 차트의 막대(경기)를 클릭했을 때, 해당 경기에서
 *              각 유저가 몇 번씩 평점을 입력했는지 집계하여 세부 차트에 사용한다.
 */
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IMatchUserRatingCount {
  user_id: string;
  nickname: string;
  rating_count: number;
}

/**
 * 경기별 유저 평점 입력 횟수 조회 (RPC 사용)
 * - 특정 경기(match_id_param)에서 유저별로 입력한 평점 개수를 내림차순으로 반환
 */
export const getMatchUserRatingCounts = async (matchId: string): Promise<ApiResponse<IMatchUserRatingCount[]>> => {
  const { data, error } = await supabase.rpc("get_match_user_rating_counts", {
    match_id_param: matchId,
  });

  if (error) throw error;

  return {
    data: (data ?? []) as IMatchUserRatingCount[],
    error: error as unknown as PostgrestError,
  };
};
