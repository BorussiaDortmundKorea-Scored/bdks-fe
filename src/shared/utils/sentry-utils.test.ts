import * as Sentry from "@sentry/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
});
