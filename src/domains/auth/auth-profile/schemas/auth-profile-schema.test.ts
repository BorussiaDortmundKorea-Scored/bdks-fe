import { describe, expect, it } from "vitest";

import { nicknameSchema } from "@auth/auth-profile/schemas/auth-profile-schema";

describe("nicknameSchema", () => {
  it("앞뒤 공백을 제거한 값을 돌려준다", () => {
    const result = nicknameSchema.safeParse("  철수  ");

    expect(result.success).toBe(true);
    expect(result.data).toBe("철수");
  });

  // 서버 왕복 없이 제출 전에 걸러지는지 확인한다
  it.each([
    ["", "닉네임을 입력해주세요"],
    ["   ", "닉네임을 입력해주세요"],
    ["가".repeat(21), "닉네임은 20자까지 입력할 수 있어요"],
  ])("잘못된 입력(%s)은 사용자 문구와 함께 거절한다", (input, message) => {
    const result = nicknameSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(message);
  });

  it("경계값인 20자는 통과시킨다", () => {
    expect(nicknameSchema.safeParse("가".repeat(20)).success).toBe(true);
  });
});
