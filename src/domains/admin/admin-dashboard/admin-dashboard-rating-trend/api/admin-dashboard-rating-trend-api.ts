/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 데이터 조회 API (RPC 사용)
 * 프로세스 설명: 월별 평점 입력량 / 경기별 평점 참여 추이를 스파크라인 카드용으로 조회
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

/** 월별 평점 입력량 (최근 N개월, 빈 달은 0으로 채워짐) */
export interface IMonthlyRatingTrend {
  bucket_month: string;
  rating_count: number;
}

/** 경기별 평점 참여 추이 (날짜 오름차순) */
export interface IMatchParticipationTrend {
  match_id: string;
  match_date: string;
  opponent_name: string;
  unique_user_count: number;
  total_rating_count: number;
}

const MONTHLY_TREND_MONTHS = 12;
const MATCH_TREND_LIMIT = 10;

/**
 * 월별 평점 입력량 조회 (RPC 사용)
 * - 최근 12개월 구간을 생성해 평점이 없는 달도 0으로 채워 반환
 */
export const getMonthlyRatingTrend = async (): Promise<ApiResponse<IMonthlyRatingTrend[]>> =>
  callRpc<IMonthlyRatingTrend[]>(() =>
    supabase.rpc("get_monthly_rating_trend", { months_count: MONTHLY_TREND_MONTHS }),
  );

/**
 * 경기별 평점 참여 추이 조회 (RPC 사용)
 * - 평점이 입력된 최근 N경기를 날짜 오름차순으로 반환 (스파크라인 좌→우 = 과거→최신)
 */
export const getMatchParticipationTrend = async (): Promise<ApiResponse<IMatchParticipationTrend[]>> =>
  callRpc<IMatchParticipationTrend[]>(() =>
    supabase.rpc("get_match_participation_trend", { limit_count: MATCH_TREND_LIMIT }),
  );
