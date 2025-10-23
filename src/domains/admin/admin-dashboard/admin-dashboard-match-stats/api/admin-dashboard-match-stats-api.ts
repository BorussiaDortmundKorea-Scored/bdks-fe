/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 데이터 조회 API (RPC 사용)
 * 프로세스 설명: Supabase RPC 함수로 경기별 유저 수와 평점 총 개수를 집계
 */
import { supabase } from "@shared/api/config/supabaseClient";

export interface IMatchStatsData {
  match_id: string;
  match_name: string;
  season: string;
  competition_name: string;
  opponent_name: string;
  match_date: string;
  unique_user_count: number;
  total_rating_count: number;
}

/**
 * 경기별 평점 통계 조회 (RPC 사용)
 * - 각 경기별로 평점을 입력한 유니크 유저 수
 * - 각 경기별로 입력된 전체 평점 개수
 * - matches, competitions, teams, ratings 테이블 JOIN
 */
export const getMatchStatsData = async (): Promise<IMatchStatsData[]> => {
  const { data, error } = await supabase.rpc("get_match_rating_stats", { limit_count: 10 });

  if (error) throw error;

  return data || [];
};
