import { describe, expect, it } from "vitest";

import { type IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import {
  applyPositionChanges,
  buildLineupBoard,
  isOnPitch,
  moveOnPitchPlayer,
  placeStarter,
  remapOnPitchToFormation,
  removeStarter,
  setCaptain,
} from "@admin/admin-match/admin-match-lineup/utils/lineup-board-utils";

import { type IPositionEntity } from "@shared/types/entities/position.entity";

let nextId = 1;
const lineup = (playerId: string, position: string | null, over: Partial<IMatchLineup> = {}): IMatchLineup => ({
  id: nextId++,
  match_id: "m",
  player_id: playerId,
  position_id: position ? `pos-${position}` : null,
  position_detail_name: position,
  position_code: null,
  lineup_type: "STARTING",
  is_captain: false,
  sub_in_minute: null,
  sub_in_partner_id: null,
  sub_out_minute: null,
  sub_out_partner_id: null,
  sub_in_partner_name: null,
  sub_out_partner_name: null,
  yellow_cards: 0,
  red_card_minute: null,
  is_sent_off: false,
  goals: 0,
  assists: 0,
  player_name: playerId,
  player_korean_name: playerId,
  created_at: null,
  updated_at: null,
  ...over,
});

const POSITIONS: IPositionEntity[] = (
  [
    ["ST", 1, 20],
    ["LAM", 2, 10],
    ["CAM", 2, 20],
    ["RAM", 2, 30],
    ["LDM", 3, 10],
    ["LCM", 3, 10],
    ["RDM", 3, 30],
    ["LB", 4, 10],
    ["LCB", 4, 20],
    ["RCB", 4, 40],
    ["RB", 4, 50],
    ["GK", 5, 10],
  ] as const
).map(([name, line, sort]) => ({
  id: `pos-${name}`,
  position_code: "XX",
  position_detail_name: name,
  line_number: line,
  sort_order: sort,
}));

const occupantsOf = (board: ReturnType<typeof buildLineupBoard>) =>
  Object.fromEntries(
    Object.values(board.slotLines ?? {})
      .flat()
      .map((slot) => [slot.slotKey, slot.occupant?.player_id ?? null]),
  );

describe("isOnPitch", () => {
  it("선발·교체 투입은 그라운드에 있고, 교체 아웃되면 빠진다. 퇴장은 그대로 둔다", () => {
    expect(isOnPitch(lineup("a", "ST"))).toBe(true);
    expect(isOnPitch(lineup("a", "ST", { lineup_type: "BENCH", sub_in_minute: 60 }))).toBe(true);
    expect(isOnPitch(lineup("a", "ST", { sub_out_minute: 60 }))).toBe(false);
    expect(isOnPitch(lineup("a", "ST", { lineup_type: "BENCH" }))).toBe(false);
    expect(isOnPitch(lineup("a", "ST", { is_sent_off: true, red_card_minute: 30 }))).toBe(true);
  });
});

describe("buildLineupBoard", () => {
  it("포메이션 자리에 그라운드 선수를 포지션 이름으로 앉히고 후보·교체아웃을 나눈다", () => {
    const lineups = [
      lineup("gk", "GK"),
      lineup("st-out", "ST", { sub_out_minute: 60 }),
      lineup("st-in", "ST", { lineup_type: "BENCH", sub_in_minute: 60 }),
      lineup("bench", null, { lineup_type: "BENCH" }),
    ];

    const board = buildLineupBoard(lineups, "4-2-3-1", POSITIONS);

    expect(occupantsOf(board)).toMatchObject({ GK: "gk", ST: "st-in", LB: null });
    expect(board.bench.map((l) => l.player_id)).toEqual(["bench"]);
    expect(board.subbedOut.map((l) => l.player_id)).toEqual(["st-out"]);
    expect(board.unplaced).toEqual([]);
  });

  it("포메이션에 자리가 없는 그라운드 선수는 unplaced 로 모은다", () => {
    const board = buildLineupBoard([lineup("lcm", "LCM"), lineup("none", null)], "4-2-3-1", POSITIONS);

    expect(board.unplaced.map((l) => l.player_id)).toEqual(["lcm", "none"]);
  });

  it("포메이션이 없으면 자리 없이 그라운드 선수 전부를 unplaced 로 둔다", () => {
    const board = buildLineupBoard([lineup("gk", "GK")], null, POSITIONS);

    expect(board.slotLines).toBeNull();
    expect(board.unplaced.map((l) => l.player_id)).toEqual(["gk"]);
  });
});

describe("선발 저장 payload", () => {
  const lineups = [
    lineup("gk", "GK", { is_captain: true }),
    lineup("lcm", "LCM"),
    lineup("nopos", null),
    lineup("bench", null, { lineup_type: "BENCH" }),
  ];

  it("placeStarter: 다른 선발은 그대로 두고 한 명만 추가한다 (포지션 없는 선발도 빠뜨리지 않는다)", () => {
    expect(placeStarter(lineups, "bench", "pos-ST")).toEqual([
      { player_id: "gk", position_id: "pos-GK", is_captain: true },
      { player_id: "lcm", position_id: "pos-LCM", is_captain: false },
      { player_id: "nopos", position_id: null, is_captain: false },
      { player_id: "bench", position_id: "pos-ST", is_captain: false },
    ]);
  });

  it("placeStarter: 이미 선발인 선수는 자리만 옮기고 주장 여부를 유지한다", () => {
    expect(placeStarter(lineups, "gk", "pos-ST")).toContainEqual({
      player_id: "gk",
      position_id: "pos-ST",
      is_captain: true,
    });
    expect(placeStarter(lineups, "gk", "pos-ST")).toHaveLength(3);
  });

  it("removeStarter: 그 선수만 뺀다", () => {
    expect(removeStarter(lineups, "lcm").map((item) => item.player_id)).toEqual(["gk", "nopos"]);
  });

  it("setCaptain: 한 명만 주장, null 이면 전부 해제", () => {
    expect(
      setCaptain(lineups, "lcm")
        .filter((item) => item.is_captain)
        .map((item) => item.player_id),
    ).toEqual(["lcm"]);
    expect(setCaptain(lineups, null).some((item) => item.is_captain)).toBe(false);
  });
});

/** 실제 positions 테이블과 같은 줄·순서 */
const REAL_POSITIONS: IPositionEntity[] = (
  [
    ["LW", 1, 5],
    ["LS", 1, 10],
    ["ST", 1, 20],
    ["RS", 1, 30],
    ["RW", 1, 40],
    ["LAM", 2, 10],
    ["CAM", 2, 20],
    ["RAM", 2, 30],
    ["LWB", 3, 5],
    ["LCM", 3, 10],
    ["LDM", 3, 10],
    ["RCM", 3, 20],
    ["CDM", 3, 20],
    ["RDM", 3, 30],
    ["RWB", 3, 40],
    ["LB", 4, 10],
    ["LCB", 4, 20],
    ["CB", 4, 30],
    ["RCB", 4, 40],
    ["RB", 4, 50],
    ["GK", 5, 10],
  ] as const
).map(([name, line, sort]) => ({
  id: `pos-${name}`,
  position_code: "XX",
  position_detail_name: name,
  line_number: line,
  sort_order: sort,
}));

describe("그라운드 자리 변경 payload", () => {
  const THREE_FOUR_TWO_ONE = ["GK", "LCB", "CB", "RCB", "LWB", "LCM", "RCM", "RWB", "LAM", "RAM", "ST"];

  it("remapOnPitchToFormation: 같은 이름 자리는 그대로 두고, 나머지는 가장 가까운 자리로 옮긴다 (기록이 있어도 옮긴다)", () => {
    const lineups = [
      ...THREE_FOUR_TWO_ONE.filter((name) => name !== "LAM").map((name) =>
        lineup(name.toLowerCase(), name, name === "ST" ? { goals: 2 } : {}),
      ),
      // LAM 선발은 교체 아웃 → 그 자리에 들어온 후보가 LAM 으로 뛰고 있다
      lineup("lam-out", "LAM", { sub_out_minute: 62, assists: 1 }),
      lineup("lam-in", "LAM", { lineup_type: "BENCH", sub_in_minute: 62 }),
    ];

    expect(remapOnPitchToFormation(lineups, "3-4-1-2", REAL_POSITIONS)).toEqual([
      { player_id: "ram", position_id: "pos-RS" },
      { player_id: "st", position_id: "pos-LS" },
      { player_id: "lam-in", position_id: "pos-CAM" },
    ]);
  });

  it("remapOnPitchToFormation: 모든 선수가 새 포메이션 자리에 맞으면 바꿀 게 없다", () => {
    const lineups = THREE_FOUR_TWO_ONE.map((name) => lineup(name, name));

    expect(remapOnPitchToFormation(lineups, "3-4-2-1", REAL_POSITIONS)).toEqual([]);
  });

  it("moveOnPitchPlayer: 자리에 누가 있으면 맞바꾸고, 비어 있으면 혼자 옮긴다", () => {
    const lam = lineup("lam", "LAM");
    const cam = lineup("cam", "CAM");

    expect(moveOnPitchPlayer(lam, "pos-CAM", cam)).toEqual([
      { player_id: "lam", position_id: "pos-CAM" },
      { player_id: "cam", position_id: "pos-LAM" },
    ]);
    expect(moveOnPitchPlayer(lam, "pos-ST", null)).toEqual([{ player_id: "lam", position_id: "pos-ST" }]);
  });

  it("applyPositionChanges: 바뀐 선수만 포지션을 덮어쓴다", () => {
    const lineups = [lineup("a", "LAM"), lineup("b", "CAM")];

    expect(
      applyPositionChanges(lineups, [{ player_id: "a", position_id: "pos-CAM" }]).map((l) => l.position_id),
    ).toEqual(["pos-CAM", "pos-CAM"]);
  });
});
