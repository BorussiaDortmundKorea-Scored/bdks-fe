import { callRpc } from "@shared/api/call-rpc";
import { supabase } from "@shared/api/config/supabaseClient";
import { type ApiResponse } from "@shared/api/types/api-types";
import { type IMatchLineupEntity } from "@shared/types/entities/match-lineup.entity";
import { type IPlayerEntity } from "@shared/types/entities/player.entity";
import { type IPositionEntity } from "@shared/types/entities/position.entity";

export type IMatchLineup = IMatchLineupEntity & {
  player_name: string;
  player_korean_name: string;
  position_code: string | null;
  position_detail_name: string | null;
  sub_in_partner_name: string | null;
  sub_out_partner_name: string | null;
};

export type ICreateMatchLineupRequest = Pick<IMatchLineupEntity, "match_id" | "player_id"> &
  Partial<Omit<IMatchLineupEntity, "id" | "match_id" | "player_id" | "created_at" | "updated_at">>;

export type IUpdateMatchLineupRequest = Pick<IMatchLineupEntity, "id"> &
  Partial<Omit<IMatchLineupEntity, "id" | "created_at" | "updated_at">>;

// 선수 목록 조회 (라인업에서 선택하기 위한)
export type IPlayer = IPlayerEntity;

// 포지션 목록 조회
export type IPosition = IPositionEntity;

export interface ISubstituteMatchLineupRequest {
  lineup_id: number;
  substitution_minute: number;
  partner_player_id: string;
}

// 특정 경기의 라인업 조회
export const getMatchLineups = async (matchId: string): Promise<ApiResponse<IMatchLineup[]>> =>
  callRpc<IMatchLineup[]>(() =>
    supabase.rpc("get_match_lineups", {
      p_match_id: matchId,
    }),
  );

// 라인업 생성
export const createMatchLineup = async (lineup: ICreateMatchLineupRequest): Promise<ApiResponse<IMatchLineup>> =>
  callRpc<IMatchLineup>(() =>
    supabase.rpc("insert_match_lineup", {
      p_match_id: lineup.match_id,
      p_player_id: lineup.player_id,
      p_position_id: lineup.position_id || null,
      p_lineup_type: lineup.lineup_type || "STARTING",
      p_is_captain: lineup.is_captain || false,
      p_sub_in_minute: lineup.sub_in_minute ?? null,
      p_sub_in_partner_id: lineup.sub_in_partner_id || null,
      p_sub_out_minute: lineup.sub_out_minute ?? null,
      p_sub_out_partner_id: lineup.sub_out_partner_id || null,
      p_yellow_cards: lineup.yellow_cards || 0,
      p_red_card_minute: lineup.red_card_minute || null,
      p_is_sent_off: lineup.is_sent_off || false,
      p_goals: lineup.goals || 0,
      p_assists: lineup.assists || 0,
    }),
  );

// 라인업 교체 적용 (선발 ↔ 교체 선수 상태/시간/포지션 반영)
export const substituteMatchLineup = async (payload: ISubstituteMatchLineupRequest): Promise<ApiResponse<boolean>> =>
  callRpc<boolean>(() =>
    supabase.rpc("substitute_match_lineup", {
      p_lineup_id: payload.lineup_id,
      p_substitution_minute: payload.substitution_minute,
      p_partner_player_id: payload.partner_player_id,
    }),
  );

// 라인업 수정
export const updateMatchLineup = async (lineup: IUpdateMatchLineupRequest): Promise<ApiResponse<IMatchLineup>> =>
  callRpc<IMatchLineup>(() =>
    supabase.rpc("update_match_lineup", {
      p_lineup_id: lineup.id,
      p_match_id: lineup.match_id,
      p_player_id: lineup.player_id,
      p_position_id: lineup.position_id,
      p_lineup_type: lineup.lineup_type,
      p_is_captain: lineup.is_captain,
      // 교체 4개 값은 폼이 항상 전체 상태를 보내므로 그대로 덮어쓴다(비우기 가능)
      p_sync_substitution: true,
      p_sub_in_minute: lineup.sub_in_minute ?? null,
      p_sub_in_partner_id: lineup.sub_in_partner_id ?? null,
      p_sub_out_minute: lineup.sub_out_minute ?? null,
      p_sub_out_partner_id: lineup.sub_out_partner_id ?? null,
      p_yellow_cards: lineup.yellow_cards,
      p_red_card_minute: lineup.red_card_minute,
      p_is_sent_off: lineup.is_sent_off,
      p_goals: lineup.goals,
      p_assists: lineup.assists,
    }),
  );

// 라인업 삭제
export const deleteMatchLineup = async (id: number): Promise<ApiResponse<boolean>> =>
  callRpc<boolean>(() =>
    supabase.rpc("delete_match_lineup", {
      p_lineup_id: id,
    }),
  );

// 선수 목록 조회 (선택박스용)
export const getAllPlayers = async (): Promise<ApiResponse<IPlayer[]>> =>
  callRpc<IPlayer[]>(() => supabase.rpc("get_all_players"));

// 포지션 목록 조회 (선택박스용)
export const getAllPositions = async (): Promise<ApiResponse<IPosition[]>> =>
  callRpc<IPosition[]>(() => supabase.rpc("get_all_positions"));

export interface ISaveMatchStartingLineupItem {
  player_id: string;
  // 포지션 미입력 선발은 null 그대로 다시 보낸다 (빠뜨리면 벤치로 내려간다)
  position_id: string | null;
  is_captain: boolean;
}

export interface ISaveMatchStartingLineupRequest {
  match_id: string;
  formation: string;
  lineups: ISaveMatchStartingLineupItem[];
}

// 포메이션 + 선발 자리 배치 저장 (기존 행은 갱신해 기록 보존, 빠진 선발은 벤치로)
export const saveMatchStartingLineup = async (
  payload: ISaveMatchStartingLineupRequest,
): Promise<ApiResponse<boolean>> =>
  callRpc<boolean>(() =>
    supabase.rpc("save_match_starting_lineup", {
      p_match_id: payload.match_id,
      p_formation: payload.formation,
      p_lineups: payload.lineups,
    }),
  );

export interface IOnPitchPositionItem {
  player_id: string;
  position_id: string;
}

export interface ISaveMatchOnPitchPositionsRequest {
  match_id: string;
  formation: string;
  /** 자리가 바뀌는 선수만 보낸다 (그라운드에 있는 선수만 허용) */
  positions: IOnPitchPositionItem[];
}

// 포메이션 변경 · 자리 맞바꾸기: 그라운드 선수의 포지션만 바꾸고 포메이션을 저장 (선발/후보·기록은 그대로)
export const saveMatchOnPitchPositions = async (
  payload: ISaveMatchOnPitchPositionsRequest,
): Promise<ApiResponse<boolean>> =>
  callRpc<boolean>(() =>
    supabase.rpc("save_match_on_pitch_positions", {
      p_match_id: payload.match_id,
      p_formation: payload.formation,
      p_positions: payload.positions,
    }),
  );

export interface IAddMatchBenchPlayersRequest {
  match_id: string;
  player_ids: string[];
}

// 후보 여러 명을 한 번에 추가 (이미 명단에 있는 선수는 건너뛰고, 실제로 넣은 인원을 돌려준다)
export const addMatchBenchPlayers = async (payload: IAddMatchBenchPlayersRequest): Promise<ApiResponse<number>> =>
  callRpc<number>(() =>
    supabase.rpc("add_match_bench_players", {
      p_match_id: payload.match_id,
      p_player_ids: payload.player_ids,
    }),
  );
