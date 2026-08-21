import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type ITeamEntity } from "@shared/types/entities/team.entity";

// 조회 뷰: get_all_teams는 countries 조인으로 country_name을 함께 반환
export type ITeam = ITeamEntity & { country_name: string | null };

export type ICreateTeamRequest = Pick<ITeamEntity, "name"> &
  Partial<Omit<ITeamEntity, "id" | "name" | "created_at" | "updated_at">>;

export type IUpdateTeamRequest = Pick<ITeamEntity, "id"> &
  Partial<Omit<ITeamEntity, "id" | "created_at" | "updated_at">>;

// 모든 팀 조회
export const getAllTeams = async (): Promise<ApiResponse<ITeam[]>> =>
  callRpc<ITeam[]>(() => supabase.rpc("get_all_teams"));

// 팀 생성
export const createTeam = async (team: ICreateTeamRequest): Promise<ApiResponse<ITeam>> =>
  callRpc<ITeam>(() =>
    supabase.rpc("insert_team", {
      team_name: team.name,
      team_country_id: team.country_id ?? null,
      team_logo_image_url: team.logo_image_url ?? null,
    }),
  );

// 팀 수정
export const updateTeam = async (team: IUpdateTeamRequest): Promise<ApiResponse<ITeam>> =>
  callRpc<ITeam>(() =>
    supabase.rpc("update_team", {
      p_team_id: team.id,
      p_team_name: team.name,
      p_team_country_id: team.country_id ?? null,
      p_team_logo_image_url: team.logo_image_url ?? null,
    }),
  );

// 팀 삭제
export const deleteTeam = async (id: string): Promise<ApiResponse<boolean>> =>
  callRpc<boolean>(() =>
    supabase.rpc("delete_team", {
      p_team_id: id,
    }),
  );
