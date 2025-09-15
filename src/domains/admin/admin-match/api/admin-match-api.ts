import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IMatch {
  id: string;
  competition_id: string;
  opponent_team_id: string;
  match_date: string;
  home_away: string;
  our_score: number;
  opponent_score: number;
  created_at: string;
  updated_at: string;
  formation: string | null;
  is_live: boolean;
  round_name: string;
  competition_name: string;
  opponent_team_name: string;
}

export interface ICreateMatchRequest {
  competition_id: string;
  opponent_team_id: string;
  match_date: string;
  home_away: string;
  our_score?: number;
  opponent_score?: number;
  formation?: string;
  is_live?: boolean;
  round_name?: string;
}

export interface IUpdateMatchRequest {
  id: string;
  competition_id?: string;
  opponent_team_id?: string;
  match_date?: string;
  home_away?: string;
  our_score?: number;
  opponent_score?: number;
  formation?: string;
  is_live?: boolean;
  round_name?: string;
}

// 모든 경기 조회
export const getAllMatches = async (): Promise<ApiResponse<IMatch[]>> => {
  const { data, error } = (await supabase.rpc("get_all_matches")) as {
    data: IMatch[];
    error: PostgrestError | null;
  };
  return { data: data as IMatch[], error: error as PostgrestError };
};

// 경기 생성
export const createMatch = async (match: ICreateMatchRequest): Promise<ApiResponse<IMatch>> => {
  const { data, error } = (await supabase.rpc("insert_match", {
    p_competition_id: match.competition_id,
    p_opponent_team_id: match.opponent_team_id,
    p_match_date: match.match_date,
    p_home_away: match.home_away,
    p_our_score: match.our_score || 0,
    p_opponent_score: match.opponent_score || 0,
    p_formation: match.formation || null,
    p_is_live: match.is_live || false,
    p_round_name: match.round_name || "",
  })) as { data: IMatch; error: PostgrestError | null };

  return {
    data: data as IMatch,
    error: error as PostgrestError,
  };
};

// 경기 수정
export const updateMatch = async (match: IUpdateMatchRequest): Promise<ApiResponse<IMatch>> => {
  const { data, error } = (await supabase.rpc("update_match", {
    p_match_id: match.id,
    p_competition_id: match.competition_id,
    p_opponent_team_id: match.opponent_team_id,
    p_match_date: match.match_date,
    p_home_away: match.home_away,
    p_our_score: match.our_score,
    p_opponent_score: match.opponent_score,
    p_formation: match.formation,
    p_is_live: match.is_live,
    p_round_name: match.round_name,
  })) as { data: IMatch; error: PostgrestError | null };

  return {
    data: data as IMatch,
    error: error as PostgrestError,
  };
};

// 경기 삭제
export const deleteMatch = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_match", {
    p_match_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};
