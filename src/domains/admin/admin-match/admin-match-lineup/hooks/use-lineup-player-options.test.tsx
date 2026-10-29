import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type IPlayer } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import {
  filterSquadPlayers,
  isDepartedPlayer,
  toPlayerOptionLabel,
  useLineupPlayerOptions,
} from "@admin/admin-match/admin-match-lineup/hooks/use-lineup-player-options";

const makePlayer = (over: Partial<IPlayer>): IPlayer =>
  ({ id: "p1", name: "Kobel", korean_name: "코벨", jersey_number: 1, is_current_squad: true, ...over }) as IPlayer;

const KOBEL = makePlayer({});
const REUS = makePlayer({ id: "p2", name: "Reus", korean_name: "로이스", jersey_number: 11, is_current_squad: false });

describe("isDepartedPlayer", () => {
  it("is_current_squad 가 false 일 때만 이적한 선수로 본다", () => {
    expect(isDepartedPlayer(REUS)).toBe(true);
    expect(isDepartedPlayer(KOBEL)).toBe(false);
  });

  // 컬럼을 내려주지 않는 옛 응답에서 전 선수가 사라지면 안 된다
  it("값이 없으면 소속 선수로 본다", () => {
    expect(isDepartedPlayer(makePlayer({ is_current_squad: undefined }))).toBe(false);
  });
});

describe("toPlayerOptionLabel", () => {
  it("한글 이름 + 등번호를 쓰고, 이적한 선수는 끝에 · 이적 을 붙인다", () => {
    expect(toPlayerOptionLabel(KOBEL)).toBe("코벨 (1번)");
    expect(toPlayerOptionLabel(REUS)).toBe("로이스 (11번) · 이적");
  });

  it("한글 이름이 없으면 영문 이름, 등번호가 없으면 이름만 쓴다", () => {
    expect(toPlayerOptionLabel(makePlayer({ korean_name: "", jersey_number: null }))).toBe("Kobel");
  });
});

describe("filterSquadPlayers", () => {
  it("기본은 이적한 선수를 빼고, includeDeparted 면 모두 돌려준다", () => {
    expect(filterSquadPlayers([KOBEL, REUS], false)).toEqual([KOBEL]);
    expect(filterSquadPlayers([KOBEL, REUS], true)).toEqual([KOBEL, REUS]);
  });
});

describe("useLineupPlayerOptions", () => {
  it("이미 라인업에 있는 선수를 빼고 label=선수 id, value=표시명 으로 만든다", () => {
    const { result } = renderHook(() => useLineupPlayerOptions([KOBEL, REUS], [{ player_id: "p1" }]));

    expect(result.current).toEqual([{ label: "p2", value: "로이스 (11번) · 이적" }]);
  });
});
