import { PostgrestError } from "@supabase/supabase-js";

import { supabase } from "@shared/api/config/supabaseClient";

export interface ICompetition {
  id: string;
  name: string;
  season: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateCompetitionRequest {
  name: string;
  season: string;
}

export interface IUpdateCompetitionRequest {
  id: string;
  name?: string;
  season?: string;
}

// API 응답 타입 정의
export interface ApiResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}

// 모든 대회 조회
export const getAllCompetitions = async (): Promise<ApiResponse<ICompetition[]>> => {
  const { data, error } = await supabase.rpc("get_all_competitions");
  return { data, error };
};

// 대회 생성
export const createCompetition = async (competition: ICreateCompetitionRequest): Promise<ApiResponse<ICompetition>> => {
  const { data, error } = await supabase.rpc("insert_competition", {
    competition_name: competition.name,
    competition_season: competition.season,
  });

  return {
    data: data?.[0] || null,
    error,
  };
};

// 대회 수정
export const updateCompetition = async (competition: IUpdateCompetitionRequest): Promise<ApiResponse<ICompetition>> => {
  const { data, error } = await supabase.rpc("update_competition", {
    competition_id: competition.id,
    competition_name: competition.name,
    competition_season: competition.season,
  });

  return {
    data: data?.[0] || null,
    error,
  };
};

// 대회 삭제
export const deleteCompetition = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = await supabase.rpc("delete_competition", {
    competition_id: id,
  });

  return { data, error };
};
