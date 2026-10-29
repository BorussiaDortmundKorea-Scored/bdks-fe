/**
 * 작성자: KYD
 * 기능: 라인업 보드 화면 계산 + 선발 저장 payload 조립
 * 프로세스 설명: 보드는 서버 라인업을 그대로 그린다(편집 중 상태를 따로 두지 않는다).
 *              자리 = 포메이션의 position_detail_name 이고, 그 자리에 "지금 그라운드에 있는" 선수를 앉힌다.
 *              교체가 일어나면 들어온 선수가 나간 선수의 포지션을 물려받으므로 같은 자리에 자연스럽게 앉는다.
 *
 *              자리 배치를 바꿀 때는 save_match_starting_lineup 에 "현재 선발 전체"를 다시 보낸다.
 *              RPC 가 빠진 선발을 벤치로 내리기 때문에, 바꾸지 않을 선발을 빠뜨리면 의도치 않게 벤치로 간다.
 *              그래서 payload 는 항상 현재 선발에서 출발해 한 군데만 고쳐서 만든다.
 *
 *              포메이션 변경·자리 맞바꾸기는 save_match_on_pitch_positions 로 "그라운드 선수의 포지션만" 바꾼다.
 *              선발/후보를 오가지 않으니 골·카드·교체 기록이 있는 선수도 자유롭게 옮길 수 있다.
 */
import {
  type IMatchLineup,
  type IOnPitchPositionItem,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { type Formation } from "@shared/constants/formation-slots";
import { type IPositionEntity } from "@shared/types/entities/position.entity";
import { type IFormationSlot, buildFormationSlotLines } from "@shared/utils/formation-slot-utils";

export interface IBoardSlot extends IFormationSlot {
  occupant: IMatchLineup | null;
}

export interface ILineupBoard {
  /** 포메이션이 없으면 null */
  slotLines: Record<number, IBoardSlot[]> | null;
  missingPositions: string[];
  /** 그라운드에 있지만 포메이션에 맞는 자리가 없는 선수 (포지션 미입력 등) */
  unplaced: IMatchLineup[];
  /** 아직 뛰지 않은 후보 */
  bench: IMatchLineup[];
  /** 교체로 나간 선수 */
  subbedOut: IMatchLineup[];
}

export interface IStarterItem {
  player_id: string;
  position_id: string | null;
  is_captain: boolean;
}

/** 지금 그라운드에 있음 = (선발이거나 교체 투입됨) 이고 아직 교체 아웃 안 됨. 퇴장은 일부러 넣지 않는다 */
export const isOnPitch = (lineup: IMatchLineup) =>
  (lineup.lineup_type === "STARTING" || lineup.sub_in_minute !== null) && lineup.sub_out_minute === null;

export const isUnusedBench = (lineup: IMatchLineup) => lineup.lineup_type === "BENCH" && lineup.sub_in_minute === null;

export function buildLineupBoard(
  lineups: IMatchLineup[],
  formation: Formation | null,
  positions: IPositionEntity[],
): ILineupBoard {
  const onPitch = lineups.filter(isOnPitch);
  const bench = lineups.filter(isUnusedBench);
  const subbedOut = lineups.filter((lineup) => lineup.sub_out_minute !== null);

  if (!formation) {
    return { slotLines: null, missingPositions: [], unplaced: onPitch, bench, subbedOut };
  }

  const { lines, missingPositions } = buildFormationSlotLines(formation, positions);
  const seatedIds = new Set<number>();

  const slotLines = Object.fromEntries(
    Object.entries(lines).map(([lineNumber, slots]) => [
      lineNumber,
      slots.map((slot) => {
        const occupant =
          onPitch.find((lineup) => !seatedIds.has(lineup.id) && lineup.position_detail_name === slot.slotKey) ?? null;
        if (occupant) seatedIds.add(occupant.id);
        return { ...slot, occupant };
      }),
    ]),
  );

  return {
    slotLines,
    missingPositions,
    unplaced: onPitch.filter((lineup) => !seatedIds.has(lineup.id)),
    bench,
    subbedOut,
  };
}

//SECTION 선발 저장 payload
const getStarterItems = (lineups: IMatchLineup[]): IStarterItem[] =>
  lineups
    .filter((lineup) => lineup.lineup_type === "STARTING")
    .map((lineup) => ({
      player_id: lineup.player_id,
      position_id: lineup.position_id,
      is_captain: lineup.is_captain === true,
    }));

/** 빈 자리에 선수를 앉힌다. 이미 선발이면 자리만 옮기고 주장 여부는 유지한다 */
export function placeStarter(lineups: IMatchLineup[], playerId: string, positionId: string): IStarterItem[] {
  const starters = getStarterItems(lineups);
  const existing = starters.find((item) => item.player_id === playerId);

  return [
    ...starters.filter((item) => item.player_id !== playerId),
    { player_id: playerId, position_id: positionId, is_captain: existing?.is_captain ?? false },
  ];
}

/** 자리에서 뺀다 (저장하면 벤치로 내려간다) */
export function removeStarter(lineups: IMatchLineup[], playerId: string): IStarterItem[] {
  return getStarterItems(lineups).filter((item) => item.player_id !== playerId);
}

/** 주장은 한 명. null 이면 주장 지정을 모두 해제한다 */
export function setCaptain(lineups: IMatchLineup[], playerId: string | null): IStarterItem[] {
  return getStarterItems(lineups).map((item) => ({ ...item, is_captain: item.player_id === playerId }));
}

//!SECTION 선발 저장 payload

//SECTION 그라운드 자리 변경 payload (save_match_on_pitch_positions)
/** 줄이 다르면 크게, 같은 줄 안에서는 좌우 거리만큼 비용을 준다 */
const LINE_DISTANCE_COST = 100;
/** 포지션이 없는 선수는 어느 자리든 같은 비용 */
const NO_POSITION_COST = 1000;
/** 자리가 모자라 못 앉히는 경우의 비용 (다른 어떤 배치보다 나쁘게) */
const UNSEATED_COST = 100_000;

/**
 * 포메이션을 바꿀 때 그라운드에 있는 선수(선발이든 교체 투입이든)를 새 포메이션 자리에 다시 앉힌다.
 * 1) 같은 이름의 자리가 있으면 그대로 둔다
 * 2) 남은 선수는 남은 자리에 "줄 차이 → 좌우 차이" 합이 가장 작아지게 배정한다 (선수·자리가 11 이하라 비트마스크 DP 로 충분)
 * 자리가 바뀌는 선수만 돌려준다. 선발/후보·기록은 건드리지 않으므로 기록이 있어도 막히지 않는다.
 */
export function remapOnPitchToFormation(
  lineups: IMatchLineup[],
  formation: Formation,
  positions: IPositionEntity[],
): IOnPitchPositionItem[] {
  const positionById = new Map(positions.map((position) => [position.id, position]));
  const slots = Object.values(buildFormationSlotLines(formation, positions).lines).flat();
  const onPitch = lineups.filter(isOnPitch);

  // 1) 이름이 같은 자리는 그대로
  const keptPlayerIds = new Set<string>();
  const openSlots = slots.filter((slot) => {
    const keeper = onPitch.find(
      (lineup) => !keptPlayerIds.has(lineup.player_id) && lineup.position_detail_name === slot.slotKey,
    );
    if (keeper) keptPlayerIds.add(keeper.player_id);
    return !keeper;
  });
  const movers = onPitch.filter((lineup) => !keptPlayerIds.has(lineup.player_id));
  if (movers.length === 0 || openSlots.length === 0) return [];

  // 2) 남은 선수 → 남은 자리 최소 비용 배정
  const cost = (lineup: IMatchLineup, slotIndex: number) => {
    const from = lineup.position_id ? positionById.get(lineup.position_id) : undefined;
    const to = positionById.get(openSlots[slotIndex].positionId);
    if (!from || !to) return NO_POSITION_COST;
    return (
      Math.abs(from.line_number - to.line_number) * LINE_DISTANCE_COST +
      Math.abs((from.sort_order ?? 0) - (to.sort_order ?? 0))
    );
  };

  const slotCount = openSlots.length;
  const memo = new Map<string, { total: number; picks: (number | null)[] }>();
  const solve = (moverIndex: number, usedMask: number): { total: number; picks: (number | null)[] } => {
    if (moverIndex === movers.length) return { total: 0, picks: [] };
    const key = `${moverIndex}:${usedMask}`;
    const cached = memo.get(key);
    if (cached) return cached;

    const skip = solve(moverIndex + 1, usedMask);
    let best = { total: skip.total + UNSEATED_COST, picks: [null, ...skip.picks] as (number | null)[] };
    for (let slotIndex = 0; slotIndex < slotCount; slotIndex++) {
      if (usedMask & (1 << slotIndex)) continue;
      const rest = solve(moverIndex + 1, usedMask | (1 << slotIndex));
      const total = rest.total + cost(movers[moverIndex], slotIndex);
      if (total < best.total) best = { total, picks: [slotIndex, ...rest.picks] };
    }
    memo.set(key, best);
    return best;
  };

  return solve(0, 0)
    .picks.map((slotIndex, moverIndex) =>
      slotIndex === null
        ? null
        : { player_id: movers[moverIndex].player_id, position_id: openSlots[slotIndex].positionId },
    )
    .filter((item): item is IOnPitchPositionItem => item !== null)
    .filter((item) => movers.find((lineup) => lineup.player_id === item.player_id)?.position_id !== item.position_id);
}

/**
 * 그라운드 선수를 다른 자리로 옮긴다. 그 자리에 누가 있으면 서로 맞바꾼다.
 * 옮기는 선수가 포지션이 없으면 맞바꿀 자리가 없으므로 원래 주인은 그대로 둔다(자리 없는 선수로 보인다).
 */
export function moveOnPitchPlayer(
  lineup: IMatchLineup,
  targetPositionId: string,
  occupant: IMatchLineup | null,
): IOnPitchPositionItem[] {
  const items: IOnPitchPositionItem[] = [{ player_id: lineup.player_id, position_id: targetPositionId }];
  if (occupant && occupant.player_id !== lineup.player_id && lineup.position_id) {
    items.push({ player_id: occupant.player_id, position_id: lineup.position_id });
  }
  return items;
}

/** 자리 변경을 저장한 직후 같은 흐름에서 다른 payload(주장 등)를 만들 때, 캐시가 갱신되기 전 값으로 되돌리지 않도록 덮어쓴다 */
export function applyPositionChanges(lineups: IMatchLineup[], changes: IOnPitchPositionItem[]): IMatchLineup[] {
  const nextPositionByPlayerId = new Map(changes.map((item) => [item.player_id, item.position_id]));
  return lineups.map((lineup) =>
    nextPositionByPlayerId.has(lineup.player_id)
      ? { ...lineup, position_id: nextPositionByPlayerId.get(lineup.player_id) ?? lineup.position_id }
      : lineup,
  );
}
//!SECTION 그라운드 자리 변경 payload
