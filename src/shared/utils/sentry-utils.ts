/**
 * 작성자: KYD
 * 기능: Sentry 에러 보고 유틸리티
 * 프로세스 설명: Supabase RPC 사용 시 400번대 에러를 Sentry에 보고하기 위함
 */
import * as Sentry from "@sentry/react";
import type { PostgrestError } from "@supabase/supabase-js";

import { RpcError, isUserInputError } from "@shared/api/rpc-error";
import type { ApiResponse } from "@shared/api/types/api-types";

/**
 * PostgrestError를 Sentry에 보고 (Supabase RPC 사용 시 400번대 에러를 Sentry에 보고하기 위함)
 * Supabase RPC는 axios를 사용하지 않으므로 별도로 처리 필요
 * 단, 사용자 입력 검증 실패는 보고하지 않는다 (호출부의 throw/toast 흐름은 그대로).
 * 판정은 RPC 가 준 SQLSTATE 로 한다 — 영문 문구를 매칭하면 문구가 바뀔 때 조용히 깨진다.
 * @param error - PostgrestError 객체
 * @param requestData - 요청 데이터 (선택사항)
 */
export const capturePostgrestError = (error: PostgrestError, requestData?: unknown): void => {
  if (isUserInputError(error.code)) return;

  const sentryError = new Error(error.message || "Supabase RPC 요청 실패");

  Sentry.captureException(sentryError, {
    tags: {
      error_type: "PostgrestError",
      error_code: error.code || "unknown",
    },
    extra: {
      error_code: error.code,
      error_details: error.details,
      error_hint: error.hint,
      error_message: error.message,
      request_data: requestData,
    },
  });
};

/**
 * Supabase RPC API 응답을 처리하고 에러 발생 시 Sentry에 보고하는 헬퍼 함수
 * useMutation의 mutationFn에서 쉽게 사용할 수 있도록 만든 함수
 * @param response - ApiResponse<T> 형태의 응답
 * @param requestData - 요청 데이터 (선택사항, 에러 발생 시 Sentry에 포함)
 * @returns response.data (에러가 없을 경우)
 * @throws RpcError (에러가 있을 경우) - code/hint 를 잃지 않고 호출부로 전달한다
 */
export const handleSupabaseApiResponse = <T>(response: ApiResponse<T>, requestData?: unknown): T => {
  if (response.error) {
    // Sentry에 에러 보고
    capturePostgrestError(response.error, requestData);
    // 호출부가 코드로 분기할 수 있도록 PostgrestError 의 code/details/hint 를 담아 던진다
    throw new RpcError(response.error);
  }
  return response.data!;
};
