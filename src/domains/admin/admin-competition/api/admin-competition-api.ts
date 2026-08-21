import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import {
  type ICompetitionEntity,
  type ICompetitionTypeEntity,
} from "@shared/types/entities/competition.entity";

export type ICompetition = ICompetitionEntity;
export type ICompetitionType = ICompetitionTypeEntity;

export interface ICreateCompetitionRequest {
  competition_type_id: string;
  season: string;
}

export interface IUpdateCompetitionRequest {
  id: string;
  competition_type_id?: string;
  season?: string;
}

// 모든 대회 조회 (competition_types와 join되어 name/name_en 포함)
export const getAllCompetitions = async (): Promise<ApiResponse<ICompetition[]>> =>
  callRpc<ICompetition[]>(() => supabase.rpc("get_all_competitions"));

// 대회 종류(마스터) 목록 조회 — 드롭다운용
export const getAllCompetitionTypes = async (): Promise<ApiResponse<ICompetitionType[]>> =>
  callRpc<ICompetitionType[]>(() => supabase.rpc("get_all_competition_types"));

// 시즌(마스터) 목록 조회 — 드롭다운용 (최신 시즌부터)
export const getAllSeasons = async (): Promise<ApiResponse<string[]>> => {
  const { data, error } = (await supabase.rpc("get_all_seasons")) as {
    data: { season: string }[];
    error: PostgrestError | null;
  };
  return { data: (data ?? []).map((row) => row.season), error: error as PostgrestError };
};

// 대회 생성
export const createCompetition = async (
  competition: ICreateCompetitionRequest,
): Promise<ApiResponse<ICompetition>> =>
  callRpc<ICompetition>(() =>
    supabase.rpc("insert_competition", {
      competition_type_id: competition.competition_type_id,
      competition_season: competition.season,
    }),
  );

// 대회 수정
export const updateCompetition = async (
  competition: IUpdateCompetitionRequest,
): Promise<ApiResponse<ICompetition>> =>
  callRpc<ICompetition>(() =>
    supabase.rpc("update_competition", {
      competition_id: competition.id,
      competition_type_id: competition.competition_type_id,
      competition_season: competition.season,
    }),
  );

// 대회 삭제
export const deleteCompetition = async (id: string): Promise<ApiResponse<boolean>> =>
  callRpc<boolean>(() =>
    supabase.rpc("delete_competition", {
      competition_id: id,
    }),
  );
