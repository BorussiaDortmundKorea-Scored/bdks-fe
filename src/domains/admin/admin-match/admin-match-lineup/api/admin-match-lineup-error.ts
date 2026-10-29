/**
 * 작성자: KYD
 * 기능: 라인업 보드 저장 RPC(선발 배치 · 그라운드 자리 변경 · 후보 일괄 추가) 에러를 사용자 문구로 옮긴다
 * 프로세스 설명: save_match_starting_lineup / save_match_on_pitch_positions / add_match_bench_players 이 message 로 올려주는 기계용 코드를 화면 문구로 매핑한다.
 */
import { resolveRpcErrorMessage } from "@shared/api/rpc-error";

/** save_match_starting_lineup 이 raise 하는 기계용 코드 */
export const SAVE_STARTING_LINEUP_ERROR_CODES = {
  MATCH_NOT_FOUND: "MATCH_NOT_FOUND",
  FORMATION_EMPTY: "FORMATION_EMPTY",
  TOO_MANY_STARTERS: "TOO_MANY_STARTERS",
  DUPLICATED_PLAYER: "DUPLICATED_PLAYER",
  MULTIPLE_CAPTAINS: "MULTIPLE_CAPTAINS",
  PLAYER_SUBBED_IN: "PLAYER_SUBBED_IN",
  STARTER_HAS_RECORDS: "STARTER_HAS_RECORDS",
} as const;

const SAVE_STARTING_LINEUP_ERROR_MESSAGES: Record<string, string> = {
  [SAVE_STARTING_LINEUP_ERROR_CODES.MATCH_NOT_FOUND]: "경기를 찾을 수 없어요",
  [SAVE_STARTING_LINEUP_ERROR_CODES.FORMATION_EMPTY]: "포메이션을 선택해주세요",
  [SAVE_STARTING_LINEUP_ERROR_CODES.TOO_MANY_STARTERS]: "선발은 11명까지 등록할 수 있어요",
  [SAVE_STARTING_LINEUP_ERROR_CODES.DUPLICATED_PLAYER]: "같은 선수가 두 자리에 배치되어 있어요",
  [SAVE_STARTING_LINEUP_ERROR_CODES.MULTIPLE_CAPTAINS]: "주장은 한 명만 지정할 수 있어요",
  [SAVE_STARTING_LINEUP_ERROR_CODES.PLAYER_SUBBED_IN]: "교체 투입 기록이 있는 선수는 선발로 바꿀 수 없어요",
  [SAVE_STARTING_LINEUP_ERROR_CODES.STARTER_HAS_RECORDS]:
    "골·카드·교체 기록이 있는 선발은 자리에서 뺄 수 없어요. 기록을 먼저 정리해주세요",
};

const SAVE_STARTING_LINEUP_FALLBACK_MESSAGE = "선발 라인업 저장에 실패했어요";

/** 선발 라인업 저장 실패를 사용자에게 보여줄 문구로 바꾼다 */
export const getSaveStartingLineupErrorMessage = (error: unknown): string =>
  resolveRpcErrorMessage(error, SAVE_STARTING_LINEUP_ERROR_MESSAGES, SAVE_STARTING_LINEUP_FALLBACK_MESSAGE);

/** save_match_on_pitch_positions 이 raise 하는 기계용 코드 */
export const SAVE_ON_PITCH_POSITIONS_ERROR_CODES = {
  MATCH_NOT_FOUND: "MATCH_NOT_FOUND",
  FORMATION_EMPTY: "FORMATION_EMPTY",
  INVALID_POSITIONS: "INVALID_POSITIONS",
  DUPLICATED_PLAYER: "DUPLICATED_PLAYER",
  POSITION_NOT_FOUND: "POSITION_NOT_FOUND",
  PLAYER_NOT_ON_PITCH: "PLAYER_NOT_ON_PITCH",
} as const;

const SAVE_ON_PITCH_POSITIONS_ERROR_MESSAGES: Record<string, string> = {
  [SAVE_ON_PITCH_POSITIONS_ERROR_CODES.MATCH_NOT_FOUND]: "경기를 찾을 수 없어요",
  [SAVE_ON_PITCH_POSITIONS_ERROR_CODES.FORMATION_EMPTY]: "포메이션을 선택해주세요",
  [SAVE_ON_PITCH_POSITIONS_ERROR_CODES.INVALID_POSITIONS]: "자리 정보가 올바르지 않아요",
  [SAVE_ON_PITCH_POSITIONS_ERROR_CODES.DUPLICATED_PLAYER]: "같은 선수가 두 자리에 배치되어 있어요",
  [SAVE_ON_PITCH_POSITIONS_ERROR_CODES.POSITION_NOT_FOUND]: "없는 포지션이 있어요",
  [SAVE_ON_PITCH_POSITIONS_ERROR_CODES.PLAYER_NOT_ON_PITCH]: "그라운드에 있는 선수만 자리를 옮길 수 있어요",
};

const SAVE_ON_PITCH_POSITIONS_FALLBACK_MESSAGE = "자리 변경에 실패했어요";

/** 포메이션 변경 · 자리 맞바꾸기 실패를 사용자에게 보여줄 문구로 바꾼다 */
export const getSaveOnPitchPositionsErrorMessage = (error: unknown): string =>
  resolveRpcErrorMessage(error, SAVE_ON_PITCH_POSITIONS_ERROR_MESSAGES, SAVE_ON_PITCH_POSITIONS_FALLBACK_MESSAGE);

/** add_match_bench_players 이 raise 하는 기계용 코드 */
export const ADD_BENCH_PLAYERS_ERROR_CODES = {
  MATCH_NOT_FOUND: "MATCH_NOT_FOUND",
  PLAYERS_EMPTY: "PLAYERS_EMPTY",
  PLAYER_NOT_FOUND: "PLAYER_NOT_FOUND",
} as const;

const ADD_BENCH_PLAYERS_ERROR_MESSAGES: Record<string, string> = {
  [ADD_BENCH_PLAYERS_ERROR_CODES.MATCH_NOT_FOUND]: "경기를 찾을 수 없어요",
  [ADD_BENCH_PLAYERS_ERROR_CODES.PLAYERS_EMPTY]: "추가할 선수를 골라주세요",
  [ADD_BENCH_PLAYERS_ERROR_CODES.PLAYER_NOT_FOUND]: "없는 선수가 있어요",
};

const ADD_BENCH_PLAYERS_FALLBACK_MESSAGE = "후보 추가에 실패했어요";

/** 후보 일괄 추가 실패를 사용자에게 보여줄 문구로 바꾼다 */
export const getAddBenchPlayersErrorMessage = (error: unknown): string =>
  resolveRpcErrorMessage(error, ADD_BENCH_PLAYERS_ERROR_MESSAGES, ADD_BENCH_PLAYERS_FALLBACK_MESSAGE);
