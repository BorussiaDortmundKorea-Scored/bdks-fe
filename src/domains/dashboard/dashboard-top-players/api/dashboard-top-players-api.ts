/**
 * 작성자: KYD
 * 기능: 대시보드 선수 기록 리더 조회 API (RPC get_dashboard_record_leaders)
 * 프로세스 설명: 단일경기 최고평점 / 통산평균 최고 / 최다골 / 최다어시 4가지 기록의 1위 선수를 조회
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export type RecordCategory = "best_match" | "best_avg" | "top_scorer" | "top_assist";

export interface IRecordLeader {
  category: RecordCategory;
  player_id: string;
  korean_name: string | null;
  name: string;
  full_profile_image_url: string | null;
  head_profile_image_url: string | null;
  metric_value: number;
}

export const getDashboardRecordLeaders = async (): Promise<ApiResponse<IRecordLeader[]>> =>
  callRpc<IRecordLeader[]>(() => supabase.rpc("get_dashboard_record_leaders"));
