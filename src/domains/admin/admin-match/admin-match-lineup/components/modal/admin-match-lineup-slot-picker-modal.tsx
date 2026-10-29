/**
 * 작성자: KYD
 * 기능: 보드의 빈 자리에 선수 배치 모달
 * 프로세스 설명: 빈 자리를 누르면 열린다. 후보 명단을 맨 위에, 그 밖의 선수는 아래에 보여주고
 *              고르면 바로 선발로 저장한다. (이미 뛰었거나 그라운드에 있는 선수는 고를 수 없다)
 *              이적한 선수는 기본으로 빼고, "이적한 선수도 보기" 를 켜면 함께 보여준다.
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { useSaveMatchStartingLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-starting-lineup";
import {
  filterSquadPlayers,
  isDepartedPlayer,
  toPlayerOptionLabel,
} from "@admin/admin-match/admin-match-lineup/hooks/use-lineup-player-options";
import { isUnusedBench, placeStarter } from "@admin/admin-match/admin-match-lineup/utils/lineup-board-utils";

import ModalFooter from "@shared/components/modal/modal-footer";
import ModalTitle from "@shared/components/modal/modal-title";
import { type Formation } from "@shared/constants/formation-slots";

interface IAdminMatchLineupSlotPickerModalProps {
  matchId: string;
  formation: Formation;
  positionId: string;
  positionName: string;
  onClose: () => void;
}

export const AdminMatchLineupSlotPickerModal = ({
  matchId,
  formation,
  positionId,
  positionName,
  onClose,
}: IAdminMatchLineupSlotPickerModalProps) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { mutateAsync: saveStartingLineup, isPending: isSaving } = useSaveMatchStartingLineup(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [includeDeparted, setIncludeDeparted] = useState(false);
  const hasDepartedPlayers = players.some(isDepartedPlayer);

  // 후보 → 명단 밖 선수 순. 그라운드에 있거나 이미 뛴 선수는 뺀다.
  // 명단 밖 선수는 이적한 선수를 기본으로 뺀다 (후보로 이미 올라와 있으면 그대로 보여준다)
  const playerOptions = useMemo(() => {
    const benchIds = new Set(lineups.filter(isUnusedBench).map((lineup) => lineup.player_id));
    const registeredIds = new Set(lineups.map((lineup) => lineup.player_id));

    const benchOptions = players
      .filter((player) => benchIds.has(player.id))
      .map((player) => ({ label: player.id, value: `${toPlayerOptionLabel(player)} · 후보` }));
    const otherOptions = filterSquadPlayers(players, includeDeparted)
      .filter((player) => !registeredIds.has(player.id))
      .map((player) => ({ label: player.id, value: toPlayerOptionLabel(player) }));

    return [...benchOptions, ...otherOptions];
  }, [players, lineups, includeDeparted]);

  // 비제어 모드라 고른 선수 id 는 selectBoxHook.label 에 있다 (label=선수 id 규칙)
  const selectBoxHook = useSelectBox({ options: playerOptions, search: true });
  const selectedPlayerId = selectBoxHook.label;
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handlePlace = async () => {
    if (!selectedPlayerId) return;

    await saveStartingLineup({
      match_id: matchId,
      formation,
      lineups: placeStarter(lineups, selectedPlayerId, positionId),
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <ModalTitle>{positionName} 자리에 선수 배치</ModalTitle>
      <SelectBox size="full" selectBoxHook={selectBoxHook} />
      {hasDepartedPlayers && (
        <CheckBox
          checked={includeDeparted}
          onCheckedChange={setIncludeDeparted}
          value="이적한 선수도 보기"
          shape="square"
        />
      )}
      <ModalFooter>
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handlePlace}
          disabled={!selectedPlayerId || isSaving}
        >
          {isSaving ? "배치 중..." : "배치"}
        </Button>
      </ModalFooter>
    </div>
  );
};
