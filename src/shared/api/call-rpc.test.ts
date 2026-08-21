import { describe, expect, it, vi } from "vitest";

import { callRpc } from "@shared/api/call-rpc";
import { type PostgrestError } from "@shared/api/types/api-types";

const pgError = {
  name: "PostgrestError",
  message: "요청 실패",
  details: "",
  hint: "",
  code: "500",
} as PostgrestError;

describe("callRpc", () => {
  it("성공 시 data를 반환하고 error는 null이다", async () => {
    const build = vi.fn().mockResolvedValue({ data: [{ id: "1" }], error: null });

    const res = await callRpc<{ id: string }[]>(build);

    expect(res).toEqual({ data: [{ id: "1" }], error: null });
    expect(build).toHaveBeenCalledTimes(1);
  });

  it("에러 발생 시 error를 그대로 전달한다", async () => {
    const build = vi.fn().mockResolvedValue({ data: null, error: pgError });

    const res = await callRpc<unknown>(build);

    expect(res.error).toBe(pgError);
    expect(res.data).toBeNull();
  });

  it("build 콜백을 실행해 그 결과값을 사용한다", async () => {
    const build = () => Promise.resolve({ data: 42, error: null });

    const res = await callRpc<number>(build);

    expect(res.data).toBe(42);
  });
});
