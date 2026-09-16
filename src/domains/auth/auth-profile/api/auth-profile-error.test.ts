import { describe, expect, it } from "vitest";

import { getCreateProfileErrorMessage, isNicknameFieldError } from "@auth/auth-profile/api/auth-profile-error";

import { RPC_ERROR_STATUS, RpcError } from "@shared/api/rpc-error";
import { type PostgrestError } from "@shared/api/types/api-types";

const makeRpcError = (over: Partial<PostgrestError>): RpcError =>
  new RpcError({ name: "PostgrestError", message: "", details: "", hint: "", code: "", ...over } as PostgrestError);

describe("getCreateProfileErrorMessage", () => {
  it.each([
    ["NICKNAME_DUPLICATED", "이미 등록된 닉네임이에요"],
    ["NICKNAME_EMPTY", "닉네임을 입력해주세요"],
    ["NICKNAME_TOO_LONG", "닉네임은 20자까지 입력할 수 있어요"],
    ["ACCOUNT_NOT_FOUND", "계정 정보를 찾을 수 없어요. 다시 로그인해주세요"],
  ])("코드 %s 를 사용자 문구로 옮긴다", (code, expected) => {
    expect(getCreateProfileErrorMessage(makeRpcError({ message: code }))).toBe(expected);
  });

  // FE 매핑이 없는 새 코드가 배포돼도 사용자는 뜻이 통하는 문구를 본다
  it("매핑이 없으면 RPC 가 준 hint 를 쓴다", () => {
    const error = makeRpcError({ message: "SOMETHING_NEW", hint: "잠시 후 다시 시도해주세요" });

    expect(getCreateProfileErrorMessage(error)).toBe("잠시 후 다시 시도해주세요");
  });

  it("매핑도 hint 도 없으면 공용 문구로 떨어진다", () => {
    expect(getCreateProfileErrorMessage(makeRpcError({ message: "SOMETHING_NEW" }))).toBe(
      "프로필 생성에 실패했어요. 잠시 후 다시 시도해주세요",
    );
  });

  it("RpcError 가 아닌 에러도 공용 문구로 떨어진다", () => {
    expect(getCreateProfileErrorMessage(new Error("boom"))).toBe("프로필 생성에 실패했어요. 잠시 후 다시 시도해주세요");
  });
});

describe("isNicknameFieldError", () => {
  it("닉네임 관련 실패는 입력 필드에 인라인으로 붙인다", () => {
    const error = makeRpcError({ message: "NICKNAME_DUPLICATED", code: RPC_ERROR_STATUS.CONFLICT });

    expect(isNicknameFieldError(error)).toBe(true);
  });

  it("계정 소실은 입력으로 고칠 수 없으므로 필드 에러가 아니다", () => {
    const error = makeRpcError({ message: "ACCOUNT_NOT_FOUND", code: RPC_ERROR_STATUS.UNAUTHORIZED });

    expect(isNicknameFieldError(error)).toBe(false);
  });
});
