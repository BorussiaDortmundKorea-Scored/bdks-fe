import { supabase } from "@shared/api/config/supabaseClient";

export interface ICompetition {
  id: string;
  name: string;
  season: string;
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
export const getAllCompetitions = async () => {
  const { data, error } = await supabase.rpc("get_all_competitions");
  if (error) {
    throw new Error(`Failed to get all competitions: ${error.message}`);
  }
  return data as ICompetition[];
};

// 대회 생성
export const createCompetition = async (competition: ICreateCompetitionRequest) => {
  const { data, error } = await supabase.rpc("insert_competition", {
    competition_name: competition.name,
    competition_season: competition.season,
  });
  if (error) {
    throw new Error(`Failed to create competition: ${error.message}`);
  }
  return data[0] as ICompetition;
};

// 대회 수정
export const updateCompetition = async (competition: IUpdateCompetitionRequest) => {
  const { data, error } = await supabase.rpc("update_competition", {
    competition_id: competition.id,
    competition_name: competition.name,
    competition_season: competition.season,
  });
  if (error) {
    throw new Error(`Failed to update competition: ${error.message}`);
  }
  return data[0] as ICompetition;
};

// 대회 삭제
export const deleteCompetition = async (id: string) => {
  const { data, error } = await supabase.rpc("delete_competition", {
    competition_id: id,
  });
  if (error) {
    throw new Error(`Failed to delete competition: ${error.message}`);
  }
  return data as boolean;
};
