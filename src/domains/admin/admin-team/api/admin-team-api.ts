import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { type ITeamEntity } from "@shared/types/entities/team.entity";

export type ITeam = ITeamEntity;

export type ICreateTeamRequest = Pick<ITeamEntity, "name"> &
  Partial<Omit<ITeamEntity, "id" | "name" | "created_at" | "updated_at">>;

export type IUpdateTeamRequest = Pick<ITeamEntity, "id"> &
  Partial<Omit<ITeamEntity, "id" | "created_at" | "updated_at">>;

// 모든 팀 조회
export const getAllTeams = async (): Promise<ApiResponse<ITeam[]>> => {
  const { data, error } = (await supabase.rpc("get_all_teams")) as { data: ITeam[]; error: PostgrestError | null };
  return { data: data as ITeam[], error: error as PostgrestError };
};

// 팀 생성
export const createTeam = async (team: ICreateTeamRequest): Promise<ApiResponse<ITeam>> => {
  const { data, error } = (await supabase.rpc("insert_team", {
    team_name: team.name,
    team_country: team.country,
    team_logo_image_url: team.logo_image_url ?? null,
  })) as { data: ITeam; error: PostgrestError | null };

  return {
    data: data as ITeam,
    error: error as PostgrestError,
  };
};

// 팀 수정
export const updateTeam = async (team: IUpdateTeamRequest): Promise<ApiResponse<ITeam>> => {
  const { data, error } = (await supabase.rpc("update_team", {
    p_team_id: team.id,
    p_team_name: team.name,
    p_team_country: team.country,
    p_team_logo_image_url: team.logo_image_url ?? null,
  })) as { data: ITeam; error: PostgrestError | null };

  return {
    data: data as ITeam,
    error: error as PostgrestError,
  };
};

// 팀 삭제
export const deleteTeam = async (id: string): Promise<ApiResponse<boolean>> => {
  const { data, error } = (await supabase.rpc("delete_team", {
    p_team_id: id,
  })) as { data: boolean; error: PostgrestError | null };

  return { data: data as boolean, error: error as PostgrestError };
};
