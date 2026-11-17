/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 조회 API (RPC get_team_count_by_country)
 * 프로세스 설명: 국가별 팀 수를 서버에서 집계해 받는다. 국가가 없는 팀은 country_id = null, "국가 미지정" 한 줄.
 *              정렬(팀 수 많은 순 → 국가명 순)도 RPC 가 해서 내려주므로 FE 는 받은 순서대로 그린다.
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface ITeamCountByCountry {
  /** 국가 미지정 팀 묶음은 null */
  country_id: string | null;
  country_name: string;
  team_count: number;
}

/** 국가별 팀 수 조회 (관리자 전용) */
export const getTeamCountByCountry = async (): Promise<ApiResponse<ITeamCountByCountry[]>> =>
  callRpc<ITeamCountByCountry[]>(() => supabase.rpc("get_team_count_by_country"));
