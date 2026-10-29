import { describe, expect, it } from "vitest";

import { FORMATION_OPTIONS, FORMATION_SLOTS, isFormation } from "@shared/constants/formation-slots";
import { type IPositionEntity } from "@shared/types/entities/position.entity";
import { buildFormationSlotLines } from "@shared/utils/formation-slot-utils";

// positions 테이블과 같은 값 (2026-10-28 dev·prod 기준, LW/RW 추가 후). id 는 이름으로 대신한다
const POSITIONS: IPositionEntity[] = [
  ["FW", "LW", 1, 5],
  ["FW", "LS", 1, 10],
  ["FW", "ST", 1, 20],
  ["FW", "RS", 1, 30],
  ["FW", "RW", 1, 40],
  ["MF", "LAM", 2, 10],
  ["MF", "CAM", 2, 20],
  ["MF", "RAM", 2, 30],
  ["MF", "LM", 3, 5],
  ["DF", "LWB", 3, 5],
  ["MF", "LCM", 3, 10],
  ["MF", "LDM", 3, 10],
  ["MF", "CDM", 3, 20],
  ["MF", "RCM", 3, 20],
  ["MF", "RDM", 3, 30],
  ["DF", "RWB", 3, 40],
  ["MF", "RM", 3, 40],
  ["DF", "LB", 4, 10],
  ["DF", "LCB", 4, 20],
  ["DF", "CB", 4, 30],
  ["DF", "RCB", 4, 40],
  ["DF", "RB", 4, 50],
  ["GK", "GK", 5, 10],
].map(([code, name, line, sort]) => ({
  id: `id-${name}`,
  position_code: code as string,
  position_detail_name: name as string,
  line_number: line as number,
  sort_order: sort as number,
}));

const lineNames = (lines: Record<number, { positionName: string }[]>) =>
  Object.fromEntries(Object.entries(lines).map(([line, slots]) => [line, slots.map((s) => s.positionName)]));

describe("FORMATION_SLOTS", () => {
  it.each(FORMATION_OPTIONS)("%s 는 중복 없는 11자리이고 GK 가 정확히 1명이다", (formation) => {
    const slots = FORMATION_SLOTS[formation];
    expect(slots).toHaveLength(11);
    expect(new Set(slots).size).toBe(11);
    expect(slots.filter((slot) => slot === "GK")).toHaveLength(1);
  });

  it.each(FORMATION_OPTIONS)("%s 의 모든 자리가 positions 테이블에 존재한다", (formation) => {
    expect(buildFormationSlotLines(formation, POSITIONS).missingPositions).toEqual([]);
  });
});

describe("isFormation", () => {
  it("상수에 있는 값만 통과시킨다", () => {
    expect(isFormation("4-2-3-1")).toBe(true);
    expect(isFormation("4-2-3-1 ")).toBe(false);
    expect(isFormation("toString")).toBe(false);
    expect(isFormation(null)).toBe(false);
    expect(isFormation(undefined)).toBe(false);
  });
});

describe("buildFormationSlotLines", () => {
  it("4-2-3-1 을 1선(공격) → 5선(GK) 줄별, 줄 안 왼쪽 → 오른쪽으로 묶는다", () => {
    const { lines } = buildFormationSlotLines("4-2-3-1", POSITIONS);

    expect(lineNames(lines)).toEqual({
      1: ["ST"],
      2: ["LAM", "CAM", "RAM"],
      3: ["LDM", "RDM"],
      4: ["LB", "LCB", "RCB", "RB"],
      5: ["GK"],
    });
  });

  it("sort_order 가 같은 자리(CDM·RCM)는 상수 배열 순서로 정렬한다", () => {
    const { lines } = buildFormationSlotLines("4-3-3", POSITIONS);

    expect(lineNames(lines)[3]).toEqual(["LCM", "CDM", "RCM"]);
    expect(lineNames(lines)[1]).toEqual(["LW", "ST", "RW"]);
  });

  it("자리마다 positions 의 id 와 줄 번호를 붙인다", () => {
    const { lines } = buildFormationSlotLines("3-4-2-1", POSITIONS);

    expect(lines[3][0]).toEqual({ slotKey: "LWB", positionId: "id-LWB", positionName: "LWB", lineNumber: 3 });
  });

  it("DB 에 없는 자리는 빼고 missingPositions 로 알려준다", () => {
    const withoutWingers = POSITIONS.filter((p) => p.position_detail_name !== "LW" && p.position_detail_name !== "RW");

    const { lines, missingPositions } = buildFormationSlotLines("4-3-3", withoutWingers);

    expect(missingPositions).toEqual(["LW", "RW"]);
    expect(lineNames(lines)[1]).toEqual(["ST"]);
  });
});
