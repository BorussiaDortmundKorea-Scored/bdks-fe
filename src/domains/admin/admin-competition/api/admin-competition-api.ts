import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";

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

// 모든 대회 조회
export const getAllCompetitions = async (): Promise<ApiResponse<ICompetition[]>> => {
  const { data, error } = (await supabase.rpc("get_all_competitions")) as {
    data: ICompetition[];
    error: PostgrestError | null;
  };
  return { data: data as ICompetition[], error: error as PostgrestError };
};

// 대회 생성
export const createCompetition = async (competition: ICreateCompetitionRequest): Promise<ApiResponse<ICompetition>> => {
  const { data, error } = (await supabase.rpc("insert_competition", {
    competition_name: competition.name,
    competition_season: competition.season,
  })) as { data: ICompetition; error: PostgrestError | null };

  return {
    data: data as ICompetition,
    error: error as PostgrestError,
  };
};

// 대회 수정
export const updateCompetition = async (competition: IUpdateCompetitionRequest): Promise<ApiResponse<ICompetition>> => {
  const { data, error } = (await supabase.rpc("update_competition", {
    competition_id: competition.id,
    competition_name: competition.name,
    competition_season: competition.season,
  })) as { data: ICompetition; error: PostgrestError | null };

  return {
    data: data as ICompetition,
    error: error as PostgrestError,
  };
};

// 대회 삭제
export const deleteCompetition = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_competition", {
    competition_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};
