/**
 * 작성자: KYD
 * 기능: Supabase RPC 에러 코드 규약
 * 프로세스 설명: RPC 가 `raise exception using errcode/message/detail/hint` 로 올려준 값을
 *                FE 가 코드로 다룰 수 있게 정규화한다. 영문 문구 매칭을 대체하기 위한 모듈.
 *
 * RPC 작성 규약 (DB 쪽)
 *   errcode : 'PT' + HTTP 상태코드 3자리 — PostgREST 가 이 숫자를 그대로 HTTP status 로 내려준다
 *   message : 기계용 코드 (SCREAMING_SNAKE). FE 는 이 값만 매칭하므로 문구를 고쳐도 안 깨진다
 *   hint    : 사용자 노출용 한글 fallback (FE 매핑이 없을 때 그대로 보여준다)
 *   detail  : 디버깅용 컨텍스트 (사용자에게 보여주지 않는다)
 */
import { type PostgrestError } from "@shared/api/types/api-types";

/** RPC 가 쓰는 SQLSTATE. PostgREST 규칙상 뒤 3자리가 HTTP 상태코드가 된다 */
export const RPC_ERROR_STATUS = {
  BAD_REQUEST: "PT400",
  UNAUTHORIZED: "PT401",
  FORBIDDEN: "PT403",
  NOT_FOUND: "PT404",
  CONFLICT: "PT409",
} as const;

/**
 * 사용자가 입력을 고치면 스스로 해결되는 에러 = 장애가 아니므로 Sentry 로 보내지 않는다.
 * 인증(PT401)·권한(PT403)은 일부러 제외했다. 탈퇴 후 남은 세션처럼 추적 가치가 있어
 * 계속 보고받아야 하는 항목이기 때문이다.
 */
const USER_INPUT_STATUSES: readonly string[] = [
  RPC_ERROR_STATUS.BAD_REQUEST,
  RPC_ERROR_STATUS.NOT_FOUND,
  RPC_ERROR_STATUS.CONFLICT,
];

/** 사용자가 입력을 고치면 해결되는 에러인지 여부 */
export const isUserInputError = (code: string | null | undefined): boolean =>
  USER_INPUT_STATUSES.includes((code ?? "").trim());

/** 값이 없는 필드를 null 로 통일한다 (PostgrestError 는 빈 문자열로 올 때가 있다) */
const emptyToNull = (value: string | null | undefined): string | null => (value?.trim() ? value : null);

/**
 * PostgrestError 를 코드/힌트를 잃지 않고 전달하기 위한 Error.
 * message 에는 RPC 가 준 기계용 코드가 그대로 담긴다 (예: "NICKNAME_DUPLICATED").
 */
export class RpcError extends Error {
  /** SQLSTATE (예: "PT409"). 규약을 따르지 않는 기존 RPC 는 "P0001" 등이 들어온다 */
  readonly code: string;
  /** 디버깅용 컨텍스트. 사용자에게 노출하지 않는다 */
  readonly details: string | null;
  /** RPC 가 준 한글 fallback 문구 */
  readonly hint: string | null;

  constructor(error: PostgrestError) {
    super(error.message || "실패");
    this.name = "RpcError";
    this.code = error.code ?? "";
    // 빈 문자열을 그대로 두면 `?? fallback` 을 통과해 빈 문구가 화면에 뜬다
    this.details = emptyToNull(error.details);
    this.hint = emptyToNull(error.hint);
  }
}

/**
 * 사용자에게 보여줄 문구를 고른다. 우선순위는 FE 매핑 → RPC 의 hint → 공용 fallback.
 * FE 매핑을 먼저 보는 이유는 DB 문구가 UI 전용이 아니라서(관리자/로그에서도 읽힌다)
 * 화면 문맥에 맞는 문구는 FE 가 정해야 하기 때문이다.
 *
 * @param error - mutationFn 에서 throw 된 에러
 * @param messages - 기계용 코드 → 한글 문구 매핑
 * @param fallback - 코드도 hint 도 없을 때 보여줄 문구
 */
export const resolveRpcErrorMessage = (error: unknown, messages: Record<string, string>, fallback: string): string => {
  if (!(error instanceof RpcError)) return fallback;
  return messages[error.message] ?? error.hint ?? fallback;
};
