import { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@shared/api/config/supabaseClient";

export interface ITeam {
  id: string;
  name: string;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICreateTeamRequest {
  name: string;
  country?: string;
}

export interface IUpdateTeamRequest {
  id: string;
  name?: string;
  country?: string;
}

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// 모든 팀 조회
export const getAllTeams = async (): Promise<ApiResponse<ITeam[]>> => {
  const { data, error } = await supabase.rpc("get_all_teams");
  return { data, error };
};

// 팀 생성
export const createTeam = async (team: ICreateTeamRequest): Promise<ApiResponse<ITeam>> => {
  const { data, error } = await supabase.rpc("insert_team", {
    team_name: team.name,
    team_country: team.country,
  });

  return {
    data: data?.[0] || null,
    error,
  };
};

// 팀 수정
export const updateTeam = async (team: IUpdateTeamRequest): Promise<ApiResponse<ITeam>> => {
  const { data, error } = await supabase.rpc("update_team", {
    p_team_id: team.id,
    p_team_name: team.name,
    p_team_country: team.country,
  });

  return {
    data: data?.[0] || null,
    error,
  };
};

// 팀 삭제
export const deleteTeam = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = await supabase.rpc("delete_team", {
    p_team_id: id,
  });

  return { data, error };
};
