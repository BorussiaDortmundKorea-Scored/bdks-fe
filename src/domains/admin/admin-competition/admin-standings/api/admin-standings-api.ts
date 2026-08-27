/**
 * 작성자: KYD
 * 기능: 리그 순위 조회 API (RPC get_standings)
 * 프로세스 설명: football-data.org에서 받아 standings 테이블에 적재된 순위를 대회별로 조회
 */
import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";

export interface IStanding {
  competition: string;
  season: string;
  position: number;
  team_name: string;
  team_tla: string | null;
  fd_team_id: number | null;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  is_our_team: boolean;
  updated_at: string;
}

/** 대회 코드별 최신 시즌 순위 조회 (BL1=분데스리가, CL=챔피언스리그) */
export const getStandings = async (competition: string): Promise<ApiResponse<IStanding[]>> =>
  callRpc<IStanding[]>(() => supabase.rpc("get_standings", { p_competition: competition }));
