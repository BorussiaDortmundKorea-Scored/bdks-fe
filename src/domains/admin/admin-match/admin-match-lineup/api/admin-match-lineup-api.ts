import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

export interface IMatchLineup {
  id: number;
  match_id: string;
  player_id: string;
  position_id: string | null;
  lineup_type: string;
  is_captain: boolean;
  substitution_status: string;
  substitution_minute: number | null;
  substitution_partner_id: string | null;
  yellow_cards: number;
  red_card_minute: number | null;
  is_sent_off: boolean;
  goals: number;
  assists: number;
  created_at: string;
  updated_at: string;
  player_name: string;
  player_korean_name: string;
  position_code: string | null;
  position_detail_name: string | null;
}

export interface ICreateMatchLineupRequest {
  match_id: string;
  player_id: string;
  position_id?: string;
  lineup_type?: string;
  is_captain?: boolean;
  substitution_status?: string;
  substitution_minute?: number;
  substitution_partner_id?: string;
  yellow_cards?: number;
  red_card_minute?: number;
  is_sent_off?: boolean;
  goals?: number;
  assists?: number;
}

export interface IUpdateMatchLineupRequest {
  id: number;
  match_id?: string;
  player_id?: string;
  position_id?: string;
  lineup_type?: string;
  is_captain?: boolean;
  substitution_status?: string;
  substitution_minute?: number;
  substitution_partner_id?: string;
  yellow_cards?: number;
  red_card_minute?: number;
  is_sent_off?: boolean;
  goals?: number;
  assists?: number;
}

// 선수 목록 조회 (라인업에서 선택하기 위한)
export interface IPlayer {
  id: string;
  name: string;
  korean_name: string;
  jersey_number: number;
  nationality: string;
  full_profile_image_url: string;
  head_profile_image_url: string;
  created_at: string;
  updated_at: string;
}

// 포지션 목록 조회
export interface IPosition {
  id: string;
  position_code: string;
  sort_order: number;
  position_detail_name: string;
  line_number: number;
}

export interface ISubstituteMatchLineupRequest {
  lineup_id: number;
  substitution_minute: number;
  partner_player_id: string;
}

// 특정 경기의 라인업 조회
export const getMatchLineups = async (matchId: string): Promise<ApiResponse<IMatchLineup[]>> => {
  const { data, error } = (await supabase.rpc("get_match_lineups", {
    p_match_id: matchId,
  })) as {
    data: IMatchLineup[];
    error: PostgrestError | null;
  };
  return { data: data as IMatchLineup[], error: error as PostgrestError };
};

// 라인업 생성
export const createMatchLineup = async (lineup: ICreateMatchLineupRequest): Promise<ApiResponse<IMatchLineup>> => {
  const { data, error } = (await supabase.rpc("insert_match_lineup", {
    p_match_id: lineup.match_id,
    p_player_id: lineup.player_id,
    p_position_id: lineup.position_id || null,
    p_lineup_type: lineup.lineup_type || "STARTING",
    p_is_captain: lineup.is_captain || false,
    p_substitution_status: lineup.substitution_status || "NONE",
    p_substitution_minute: lineup.substitution_minute || null,
    p_substitution_partner_id: lineup.substitution_partner_id || null,
    p_yellow_cards: lineup.yellow_cards || 0,
    p_red_card_minute: lineup.red_card_minute || null,
    p_is_sent_off: lineup.is_sent_off || false,
    p_goals: lineup.goals || 0,
    p_assists: lineup.assists || 0,
  })) as { data: IMatchLineup; error: PostgrestError | null };

  return {
    data: data as IMatchLineup,
    error: error as PostgrestError,
  };
};

// 라인업 교체 적용 (선발 ↔ 교체 선수 상태/시간/포지션 반영)
export const substituteMatchLineup = async (payload: ISubstituteMatchLineupRequest): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("substitute_match_lineup", {
    p_lineup_id: payload.lineup_id,
    p_substitution_minute: payload.substitution_minute,
    p_partner_player_id: payload.partner_player_id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};

// 라인업 수정
export const updateMatchLineup = async (lineup: IUpdateMatchLineupRequest): Promise<ApiResponse<IMatchLineup>> => {
  const { data, error } = (await supabase.rpc("update_match_lineup", {
    p_lineup_id: lineup.id,
    p_match_id: lineup.match_id,
    p_player_id: lineup.player_id,
    p_position_id: lineup.position_id,
    p_lineup_type: lineup.lineup_type,
    p_is_captain: lineup.is_captain,
    p_substitution_status: lineup.substitution_status,
    p_substitution_minute: lineup.substitution_minute,
    p_substitution_partner_id: lineup.substitution_partner_id,
    p_yellow_cards: lineup.yellow_cards,
    p_red_card_minute: lineup.red_card_minute,
    p_is_sent_off: lineup.is_sent_off,
    p_goals: lineup.goals,
    p_assists: lineup.assists,
  })) as { data: IMatchLineup; error: PostgrestError | null };

  return {
    data: data as IMatchLineup,
    error: error as PostgrestError,
  };
};

// 라인업 삭제
export const deleteMatchLineup = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_match_lineup", {
    p_lineup_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};

// 선수 목록 조회 (선택박스용)
export const getAllPlayers = async (): Promise<ApiResponse<IPlayer[]>> => {
  const { data, error } = (await supabase.rpc("get_all_players")) as {
    data: IPlayer[];
    error: PostgrestError | null;
  };
  return { data: data as IPlayer[], error: error as PostgrestError };
};

// 포지션 목록 조회 (선택박스용)
export const getAllPositions = async (): Promise<ApiResponse<IPosition[]>> => {
  const { data, error } = (await supabase.rpc("get_all_positions")) as {
    data: IPosition[];
    error: PostgrestError | null;
  };
  return { data: data as IPosition[], error: error as PostgrestError };
};
