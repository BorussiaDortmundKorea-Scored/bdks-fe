/**
 * 작성자: KYD
 * 기능: 평점 분포 / 경기 시간별 입력량 조회 API (RPC get_rating_stats)
 * 프로세스 설명: PagedCard 두 페이지(점수대 분포 / 경기 시간별 입력량)가 같은 응답을 나눠 쓰므로
 *              RPC 한 번으로 두 집계를 함께 받아온다.
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

/** 점수대 버킷. bucket 0~10 = floor(rating), 10 은 만점(10.0)까지 포함 */
export interface IRatingDistributionBucket {
  bucket: number;
  rating_count: number;
}

/**
 * 경기 진행 시점 버킷. 경기 전 → 전반 → 하프타임 → 후반 → 경기 종료 순서이며
 * phase_order 로 정렬돼 온다 (해당 시점 입력이 0건이어도 버킷은 채워져 온다).
 */
export interface IRatingPhaseBucket {
  phase_order: number;
  phase_label: string;
  rating_count: number;
}

export interface IRatingStats {
  total_rating_count: number;
  average_rating: number;
  distribution: IRatingDistributionBucket[];
  phase: IRatingPhaseBucket[];
}

/** 평점 분포 + 경기 시간별 입력량 조회 (관리자 전용) */
export const getRatingStats = async (): Promise<ApiResponse<IRatingStats>> =>
  callRpc<IRatingStats>(() => supabase.rpc("get_rating_stats"));
