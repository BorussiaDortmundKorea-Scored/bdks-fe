/**
 * 작성자: KYD
 * 기능: Sentry 에러 보고 유틸리티
 * 프로세스 설명: Supabase RPC 사용 시 400번대 에러를 Sentry에 보고하기 위함
 */
import * as Sentry from "@sentry/react";
import type { PostgrestError } from "@supabase/supabase-js";

import type { ApiResponse } from "@shared/api/types/api-types";

/**
 * PostgrestError를 Sentry에 보고 (Supabase RPC 사용 시 400번대 에러를 Sentry에 보고하기 위함)
 * Supabase RPC는 axios를 사용하지 않으므로 별도로 처리 필요
 * @param error - PostgrestError 객체
 * @param requestData - 요청 데이터 (선택사항)
 */
export const capturePostgrestError = (error: PostgrestError, requestData?: unknown): void => {
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
 * @throws Error (에러가 있을 경우)
 */
export const handleSupabaseApiResponse = <T>(response: ApiResponse<T>, requestData?: unknown): T => {
  if (response.error) {
    // Sentry에 에러 보고
    capturePostgrestError(response.error, requestData);
    // 사용자에게 보여줄 에러 메시지 생성
    const errorMessage = response.error.message || `실패`;
    throw new Error(errorMessage);
  }
  return response.data!;
};
