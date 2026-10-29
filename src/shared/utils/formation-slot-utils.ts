/**
 * 작성자: KYD
 * 기능: 포메이션 → 줄(line_number)별 자리 목록 변환
 * 프로세스 설명: 상수에는 자리 이름만 있고, 몇 번째 줄·줄 안의 순서는 positions 테이블이 알고 있다.
 *              둘을 이름으로 이어 붙여 FormationLineLayout 이 그대로 그릴 수 있는 Record<line, slot[]> 로 만든다.
 *              줄 안 정렬은 sort_order → 상수 배열 순서. (CDM·RCM 처럼 sort_order 가 같은 자리가 있어서)
 *              상수에는 있는데 DB 에 없는 자리는 버리지 않고 missingPositions 로 돌려줘 화면에서 경고하게 한다.
 */
import { FORMATION_SLOTS, type Formation } from "@shared/constants/formation-slots";
import { type IPositionEntity } from "@shared/types/entities/position.entity";

export interface IFormationSlot {
  /** 같은 포메이션 안에서 자리를 구분하는 키 (= position_detail_name) */
  slotKey: string;
  positionId: string;
  positionName: string;
  lineNumber: number;
}

export interface IFormationSlotLines {
  lines: Record<number, IFormationSlot[]>;
  missingPositions: string[];
}

export function buildFormationSlotLines(formation: Formation, positions: IPositionEntity[]): IFormationSlotLines {
  const positionByName = new Map(
    positions.filter((position) => position.position_detail_name).map((p) => [p.position_detail_name!, p]),
  );

  const missingPositions: string[] = [];
  const ordered = FORMATION_SLOTS[formation]
    .map((name, slotIndex) => {
      const position = positionByName.get(name);
      if (!position) {
        missingPositions.push(name);
        return null;
      }
      return { name, slotIndex, position };
    })
    .filter((slot) => slot !== null)
    .sort(
      (a, b) =>
        a.position.line_number - b.position.line_number ||
        (a.position.sort_order ?? 0) - (b.position.sort_order ?? 0) ||
        a.slotIndex - b.slotIndex,
    );

  const lines = ordered.reduce<Record<number, IFormationSlot[]>>((acc, { name, position }) => {
    (acc[position.line_number] ??= []).push({
      slotKey: name,
      positionId: position.id,
      positionName: name,
      lineNumber: position.line_number,
    });
    return acc;
  }, {});

  return { lines, missingPositions };
}
