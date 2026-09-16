import * as Sentry from "@sentry/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RPC_ERROR_STATUS, RpcError } from "@shared/api/rpc-error";
import { type ApiResponse, type PostgrestError } from "@shared/api/types/api-types";
import { capturePostgrestError, handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

vi.mock("@sentry/react", () => ({
  captureException: vi.fn(),
}));

const makeError = (over: Partial<PostgrestError> = {}): PostgrestError =>
  ({
    name: "PostgrestError",
    message: "DB 오류",
    details: "detail",
    hint: "hint",
    code: "42501",
    ...over,
  }) as PostgrestError;

describe("handleSupabaseApiResponse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("에러가 없으면 data를 반환하고 Sentry에 보고하지 않는다", () => {
    const response: ApiResponse<number[]> = { data: [1, 2, 3], error: null };

    const result = handleSupabaseApiResponse(response);

    expect(result).toEqual([1, 2, 3]);
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("에러가 있으면 메시지로 throw하고 Sentry에 보고한다", () => {
    const error = makeError({ message: "권한이 필요합니다" });
    const response: ApiResponse<number[]> = { data: [], error };

    expect(() => handleSupabaseApiResponse(response)).toThrow("권한이 필요합니다");
    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });

  it("에러 메시지가 비어 있으면 '실패'로 throw한다", () => {
    const error = makeError({ message: "" });
    const response: ApiResponse<number[]> = { data: [], error };

    expect(() => handleSupabaseApiResponse(response)).toThrow("실패");
  });

  // 호출부가 문구가 아니라 코드로 분기할 수 있어야 한다
  it("RpcError 로 던져 code/details/hint 를 호출부에 전달한다", () => {
    const error = makeError({
      code: RPC_ERROR_STATUS.CONFLICT,
      message: "NICKNAME_DUPLICATED",
      details: "nickname=철수",
      hint: "이미 등록된 닉네임이에요",
    });
    const response: ApiResponse<number[]> = { data: [], error };

    try {
      handleSupabaseApiResponse(response);
      expect.unreachable("에러가 던져져야 한다");
    } catch (thrown) {
      expect(thrown).toBeInstanceOf(RpcError);
      const rpcError = thrown as RpcError;
      expect(rpcError.code).toBe(RPC_ERROR_STATUS.CONFLICT);
      expect(rpcError.message).toBe("NICKNAME_DUPLICATED");
      expect(rpcError.details).toBe("nickname=철수");
      expect(rpcError.hint).toBe("이미 등록된 닉네임이에요");
    }
  });
});

describe("capturePostgrestError", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("에러 코드/상세를 태그·extra로 담아 Sentry에 보고한다", () => {
    const error = makeError({ code: "23505", message: "중복 키" });

    capturePostgrestError(error, { userId: "u1" });

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    const [, context] = (Sentry.captureException as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(context.tags.error_code).toBe("23505");
    expect(context.extra.request_data).toEqual({ userId: "u1" });
  });

  // 사용자 입력 검증 실패는 장애가 아니라 정상 흐름 → Sentry 노이즈를 만들지 않는다
  it.each([RPC_ERROR_STATUS.BAD_REQUEST, RPC_ERROR_STATUS.NOT_FOUND, RPC_ERROR_STATUS.CONFLICT])(
    "사용자 입력 에러(%s)는 Sentry에 보고하지 않는다",
    (code) => {
      capturePostgrestError(makeError({ code, message: "NICKNAME_DUPLICATED" }));

      expect(Sentry.captureException).not.toHaveBeenCalled();
    },
  );

  // 탈퇴 후 남은 세션처럼 추적 가치가 있는 항목은 계속 보고받아야 한다
  it.each([RPC_ERROR_STATUS.UNAUTHORIZED, RPC_ERROR_STATUS.FORBIDDEN])(
    "인증·권한 에러(%s)는 그대로 보고한다",
    (code) => {
      capturePostgrestError(makeError({ code, message: "ACCOUNT_NOT_FOUND" }));

      expect(Sentry.captureException).toHaveBeenCalledTimes(1);
    },
  );

  it("규약을 따르지 않는 기존 RPC 에러(P0001)는 그대로 보고한다", () => {
    capturePostgrestError(makeError({ code: "P0001", message: "Nickname already exists" }));

    expect(Sentry.captureException).toHaveBeenCalledTimes(1);
  });
});
