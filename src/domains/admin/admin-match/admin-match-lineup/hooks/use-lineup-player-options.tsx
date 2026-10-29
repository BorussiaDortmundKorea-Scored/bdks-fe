/**
 * 작성자: KYD
 * 기능: 라인업 선수 SelectBox 옵션 생성 훅
 * 프로세스 설명: 전체 선수 목록을 SelectBox 옵션(label=선수 id, value=화면 표시명)으로 변환한다.
 *                registeredLineups 를 넘기면 이미 이 경기 라인업에 등록된 선수를 옵션에서 제외한다.
 *                (경기 진행 중 선수를 추가할 때 이미 명단에 있는 선수가 또 보이는 것을 막기 위함)
 *                이적한 선수는 표시명 끝에 " · 이적" 을 붙이고, 새로 넣는 화면에서는 filterSquadPlayers 로 기본 제외한다.
 */
import { useMemo } from "react";

import { type IPlayer } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

/** 기본값을 매 렌더 새로 만들면 useMemo 가 무의미해져 모듈 상수로 고정한다 */
const NO_REGISTERED_LINEUPS: readonly { player_id: string }[] = [];

/** 이적 등으로 지금 스쿼드에 없는 선수. 값이 없으면(옛 데이터) 소속으로 본다 */
export const isDepartedPlayer = (player: IPlayer) => player.is_current_squad === false;

export const toPlayerOptionLabel = (player: IPlayer) =>
  `${player.korean_name || player.name}${player.jersey_number ? ` (${player.jersey_number}번)` : ""}${isDepartedPlayer(player) ? " · 이적" : ""}`;

/**
 * 라인업에 새로 넣을 선수 후보. 평소엔 현 스쿼드만 보여주고,
 * 지난 경기를 정리할 때처럼 이적한 선수가 필요하면 includeDeparted 로 함께 보여준다.
 */
export const filterSquadPlayers = (players: IPlayer[], includeDeparted: boolean) =>
  includeDeparted ? players : players.filter((player) => !isDepartedPlayer(player));

export const useLineupPlayerOptions = (
  players: IPlayer[],
  registeredLineups: readonly { player_id: string }[] = NO_REGISTERED_LINEUPS,
) => {
  return useMemo(() => {
    const registeredPlayerIds = new Set(registeredLineups.map((lineup) => lineup.player_id));

    return players
      .filter((player) => !registeredPlayerIds.has(player.id))
      .map((player) => ({ label: player.id, value: toPlayerOptionLabel(player) }));
  }, [players, registeredLineups]);
};
