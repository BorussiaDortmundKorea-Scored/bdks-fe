/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 조회 API (RPC get_user_retention_funnel)
 * 프로세스 설명: 가입 → 첫 평점(활성화) → 재방문 → 핵심 4단계 인원을 한 번에 받아온다.
 *              재방문/핵심은 누적 경기 수가 아니라 "가입 이후 열린 경기(기회) 대비 참여율"로 판정한다.
 *              절대 경기 수는 시즌이 길어질수록 기준의 의미가 변하고 최근 가입자가 불리해진다.
 *              임계값은 RPC가 함께 내려줘서 FE 라벨이 DB와 어긋나지 않는다.
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IRetentionFunnel {
  /** 전체 가입자 수 */
  total_users: number;
  /** 평점을 한 번이라도 입력한 회원 수 (활성화) */
  activated_users: number;
  /** 참여율이 retained_rate_threshold(%) 이상인 회원 수 (재방문) */
  retained_users: number;
  /** 참여율이 core_rate_threshold(%) 이상인 회원 수 (핵심) */
  core_users: number;
  /** 활성 회원의 평균 참여율(%) */
  avg_participation_rate: number;
  /** 재방문 판정 기준 참여율(%) */
  retained_rate_threshold: number;
  /** 핵심 판정 기준 참여율(%) */
  core_rate_threshold: number;
}

/** 회원 리텐션 퍼널 조회 (관리자 전용) */
export const getUserRetentionFunnel = async (): Promise<ApiResponse<IRetentionFunnel>> =>
  callRpc<IRetentionFunnel>(() => supabase.rpc("get_user_retention_funnel"));
