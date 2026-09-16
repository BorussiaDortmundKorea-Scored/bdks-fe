/**
 * 작성자: KYD
 * 기능: 프로필 생성 RPC 에러를 사용자 문구로 옮긴다
 * 프로세스 설명: insert_auth_profile 이 message 로 올려주는 기계용 코드를 화면 문구로 매핑한다.
 *                문구가 아니라 코드를 매칭하므로 DB 의 hint 를 고쳐도 매핑이 깨지지 않는다.
 */
import { RpcError, resolveRpcErrorMessage } from "@shared/api/rpc-error";

/** insert_auth_profile 이 raise 하는 기계용 코드 */
export const AUTH_PROFILE_ERROR_CODES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  ACCOUNT_NOT_FOUND: "ACCOUNT_NOT_FOUND",
  NICKNAME_EMPTY: "NICKNAME_EMPTY",
  NICKNAME_TOO_LONG: "NICKNAME_TOO_LONG",
  PROFILE_ALREADY_EXISTS: "PROFILE_ALREADY_EXISTS",
  NICKNAME_DUPLICATED: "NICKNAME_DUPLICATED",
} as const;

const AUTH_PROFILE_ERROR_MESSAGES: Record<string, string> = {
  [AUTH_PROFILE_ERROR_CODES.UNAUTHENTICATED]: "로그인이 필요해요",
  [AUTH_PROFILE_ERROR_CODES.ACCOUNT_NOT_FOUND]: "계정 정보를 찾을 수 없어요. 다시 로그인해주세요",
  [AUTH_PROFILE_ERROR_CODES.NICKNAME_EMPTY]: "닉네임을 입력해주세요",
  [AUTH_PROFILE_ERROR_CODES.NICKNAME_TOO_LONG]: "닉네임은 20자까지 입력할 수 있어요",
  [AUTH_PROFILE_ERROR_CODES.PROFILE_ALREADY_EXISTS]: "이미 프로필이 등록되어 있어요",
  [AUTH_PROFILE_ERROR_CODES.NICKNAME_DUPLICATED]: "이미 등록된 닉네임이에요",
};

const CREATE_PROFILE_FALLBACK_MESSAGE = "프로필 생성에 실패했어요. 잠시 후 다시 시도해주세요";

/** 프로필 생성 실패를 사용자에게 보여줄 문구로 바꾼다 */
export const getCreateProfileErrorMessage = (error: unknown): string =>
  resolveRpcErrorMessage(error, AUTH_PROFILE_ERROR_MESSAGES, CREATE_PROFILE_FALLBACK_MESSAGE);

/**
 * 닉네임 입력 필드 밑에 붙여야 하는 에러인지 여부.
 * 중복처럼 서버만 알 수 있는 실패도 입력 필드에서 고치는 문제이므로 인라인으로 보여준다.
 */
export const isNicknameFieldError = (error: unknown): boolean =>
  error instanceof RpcError && error.message.startsWith("NICKNAME_");
