import { describe, expect, it } from "vitest";

import {
  getAddBenchPlayersErrorMessage,
  getSaveOnPitchPositionsErrorMessage,
  getSaveStartingLineupErrorMessage,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-error";

import { RpcError } from "@shared/api/rpc-error";
import { type PostgrestError } from "@shared/api/types/api-types";

const makeRpcError = (over: Partial<PostgrestError>): RpcError =>
  new RpcError({ name: "PostgrestError", message: "", details: "", hint: "", code: "", ...over } as PostgrestError);

describe("getSaveStartingLineupErrorMessage", () => {
  it.each([
    ["MATCH_NOT_FOUND", "경기를 찾을 수 없어요"],
    ["FORMATION_EMPTY", "포메이션을 선택해주세요"],
    ["TOO_MANY_STARTERS", "선발은 11명까지 등록할 수 있어요"],
    ["DUPLICATED_PLAYER", "같은 선수가 두 자리에 배치되어 있어요"],
    ["MULTIPLE_CAPTAINS", "주장은 한 명만 지정할 수 있어요"],
    ["PLAYER_SUBBED_IN", "교체 투입 기록이 있는 선수는 선발로 바꿀 수 없어요"],
    ["STARTER_HAS_RECORDS", "골·카드·교체 기록이 있는 선발은 자리에서 뺄 수 없어요. 기록을 먼저 정리해주세요"],
  ])("코드 %s 를 사용자 문구로 옮긴다", (code, expected) => {
    expect(getSaveStartingLineupErrorMessage(makeRpcError({ message: code }))).toBe(expected);
  });

  it("매핑도 hint 도 없으면 공용 문구로 떨어진다", () => {
    expect(getSaveStartingLineupErrorMessage(makeRpcError({ message: "SOMETHING_NEW" }))).toBe(
      "선발 라인업 저장에 실패했어요",
    );
  });
});

describe("getSaveOnPitchPositionsErrorMessage", () => {
  it.each([
    ["MATCH_NOT_FOUND", "경기를 찾을 수 없어요"],
    ["FORMATION_EMPTY", "포메이션을 선택해주세요"],
    ["INVALID_POSITIONS", "자리 정보가 올바르지 않아요"],
    ["DUPLICATED_PLAYER", "같은 선수가 두 자리에 배치되어 있어요"],
    ["POSITION_NOT_FOUND", "없는 포지션이 있어요"],
    ["PLAYER_NOT_ON_PITCH", "그라운드에 있는 선수만 자리를 옮길 수 있어요"],
  ])("코드 %s 를 사용자 문구로 옮긴다", (code, expected) => {
    expect(getSaveOnPitchPositionsErrorMessage(makeRpcError({ message: code }))).toBe(expected);
  });

  // FE 매핑이 없는 새 코드가 배포돼도 사용자는 뜻이 통하는 문구를 본다
  it("매핑이 없으면 RPC 가 준 hint 를 쓴다", () => {
    const error = makeRpcError({ message: "SOMETHING_NEW", hint: "잠시 후 다시 시도해주세요" });

    expect(getSaveOnPitchPositionsErrorMessage(error)).toBe("잠시 후 다시 시도해주세요");
  });

  it("RpcError 가 아닌 에러는 공용 문구로 떨어진다", () => {
    expect(getSaveOnPitchPositionsErrorMessage(new Error("boom"))).toBe("자리 변경에 실패했어요");
  });
});

describe("getAddBenchPlayersErrorMessage", () => {
  it.each([
    ["MATCH_NOT_FOUND", "경기를 찾을 수 없어요"],
    ["PLAYERS_EMPTY", "추가할 선수를 골라주세요"],
    ["PLAYER_NOT_FOUND", "없는 선수가 있어요"],
  ])("코드 %s 를 사용자 문구로 옮긴다", (code, expected) => {
    expect(getAddBenchPlayersErrorMessage(makeRpcError({ message: code }))).toBe(expected);
  });

  it("매핑도 hint 도 없으면 공용 문구로 떨어진다", () => {
    expect(getAddBenchPlayersErrorMessage(makeRpcError({ message: "SOMETHING_NEW" }))).toBe("후보 추가에 실패했어요");
  });
});
