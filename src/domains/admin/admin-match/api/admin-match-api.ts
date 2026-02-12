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
  created_at: Date;
  updated_at: Date;
  formation: string | null;
  is_live: boolean;
  round_name: string;
  competition_name: string;
  opponent_team_name: string;
  match_start_time: Date;
  second_half_start_time: Date;
  first_half_end_time: Date;
  second_half_end_time: Date;
}

export interface IBulkCreateMatchItem {
  competition_id: string;
  opponent_team_id: string;
  match_date: string;
  home_away: "HOME" | "AWAY";
  match_start_time: string;
  round_name?: string;
}

export interface IBulkCreateMatchesRequest {
  matches: IBulkCreateMatchItem[];
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
  match_start_time: string;
  second_half_start_time: string;
  first_half_end_time: string;
  second_half_end_time: string;
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
  match_start_time: string;
  second_half_start_time: string;
  first_half_end_time: string;
  second_half_end_time: string;
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
    p_match_start_time: match.match_start_time || null,
    p_second_half_start_time: match.second_half_start_time || null,
    p_first_half_end_time: match.first_half_end_time || null,
    p_second_half_end_time: match.second_half_end_time || null,
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
    p_match_start_time: match.match_start_time,
    p_second_half_start_time: match.second_half_start_time,
    p_first_half_end_time: match.first_half_end_time,
    p_second_half_end_time: match.second_half_end_time,
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

export const bulkCreateMatches = async (
  payload: IBulkCreateMatchesRequest,
): Promise<ApiResponse<IMatch[]>> => {
  const { data, error } = (await supabase.rpc("bulk_insert_matches", {
    p_matches: payload.matches,
  })) as { data: IMatch[]; error: PostgrestError | null };

  return {
    data: data as IMatch[],
    error: error as PostgrestError,
  };
};
