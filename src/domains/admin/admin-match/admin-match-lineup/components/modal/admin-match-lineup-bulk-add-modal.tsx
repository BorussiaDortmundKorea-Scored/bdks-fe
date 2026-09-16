/**
 * 작성자: KYD
 * 기능: 스타팅 명단등록 모달 컴포넌트
 * 프로세스 설명: 11명의 선수와 포지션, 주장여부를 선택하여 선발명단을 일괄 추가
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, SelectBox, useSelectBox } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { useBulkCreateMatchLineups } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-bulk-create-match-lineups";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { useLineupPlayerOptions } from "@admin/admin-match/admin-match-lineup/hooks/use-lineup-player-options";
import { adminMatchLineupBulkSchema } from "@admin/admin-match/admin-match-lineup/schemas/admin-match-lineup-schema";

interface IPlayerSelection {
  player_id: string;
  position_id: string;
  is_captain: boolean;
}

interface IAdminMatchLineupBulkAddModal {
  matchId: string;
  onClose: () => void;
}

export const AdminMatchLineupBulkAddModal = ({ matchId, onClose }: IAdminMatchLineupBulkAddModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: positions } = useGetAllPositionsSuspense();
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { mutateAsync: bulkCreateLineups, isPending: isCreating } = useBulkCreateMatchLineups(matchId);
  const { toast } = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [selections, setSelections] = useState<IPlayerSelection[]>(
    Array.from({ length: 11 }, () => ({
      player_id: "",
      position_id: "",
      is_captain: false,
    })),
  );
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  // 이미 이 경기 명단에 등록된 선수는 다시 고를 수 없게 옵션에서 뺀다
  const playerOptions = useLineupPlayerOptions(players, lineups);

  const positionOptions = useMemo(
    () => positions.map((pos) => ({ label: pos.id, value: `${pos.position_detail_name} (${pos.position_code})` })),
    [positions],
  );

  // React Hook 규칙 준수를 위해 각 hook을 개별 선언
  const playerHook0 = useSelectBox({ options: playerOptions, search: true });
  const positionHook0 = useSelectBox({ options: positionOptions, search: true });
  const playerHook1 = useSelectBox({ options: playerOptions, search: true });
  const positionHook1 = useSelectBox({ options: positionOptions, search: true });
  const playerHook2 = useSelectBox({ options: playerOptions, search: true });
  const positionHook2 = useSelectBox({ options: positionOptions, search: true });
  const playerHook3 = useSelectBox({ options: playerOptions, search: true });
  const positionHook3 = useSelectBox({ options: positionOptions, search: true });
  const playerHook4 = useSelectBox({ options: playerOptions, search: true });
  const positionHook4 = useSelectBox({ options: positionOptions, search: true });
  const playerHook5 = useSelectBox({ options: playerOptions, search: true });
  const positionHook5 = useSelectBox({ options: positionOptions, search: true });
  const playerHook6 = useSelectBox({ options: playerOptions, search: true });
  const positionHook6 = useSelectBox({ options: positionOptions, search: true });
  const playerHook7 = useSelectBox({ options: playerOptions, search: true });
  const positionHook7 = useSelectBox({ options: positionOptions, search: true });
  const playerHook8 = useSelectBox({ options: playerOptions, search: true });
  const positionHook8 = useSelectBox({ options: positionOptions, search: true });
  const playerHook9 = useSelectBox({ options: playerOptions, search: true });
  const positionHook9 = useSelectBox({ options: positionOptions, search: true });
  const playerHook10 = useSelectBox({ options: playerOptions, search: true });
  const positionHook10 = useSelectBox({ options: positionOptions, search: true });

  const selectBoxHooks = [
    { playerHook: playerHook0, positionHook: positionHook0 },
    { playerHook: playerHook1, positionHook: positionHook1 },
    { playerHook: playerHook2, positionHook: positionHook2 },
    { playerHook: playerHook3, positionHook: positionHook3 },
    { playerHook: playerHook4, positionHook: positionHook4 },
    { playerHook: playerHook5, positionHook: positionHook5 },
    { playerHook: playerHook6, positionHook: positionHook6 },
    { playerHook: playerHook7, positionHook: positionHook7 },
    { playerHook: playerHook8, positionHook: positionHook8 },
    { playerHook: playerHook9, positionHook: positionHook9 },
    { playerHook: playerHook10, positionHook: positionHook10 },
  ];
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역

  const handleCaptainChange = (index: number, isCaptain: boolean) => {
    const newSelections = [...selections];
    // 다른 선수의 주장 체크 해제
    if (isCaptain) {
      newSelections.forEach((sel, idx) => {
        if (idx !== index) {
          sel.is_captain = false;
        }
      });
    }
    newSelections[index] = { ...newSelections[index], is_captain: isCaptain };
    setSelections(newSelections);
  };

  const handleBulkCreate = async () => {
    // SelectBox hook에서 최신 값 가져오기
    const currentSelections = selectBoxHooks.map((hook, index) => ({
      player_id: (hook.playerHook.label as string) || "",
      position_id: (hook.positionHook.label as string) || "",
      is_captain: selections[index]?.is_captain || false,
    }));

    // 선수와 포지션을 둘 다 고른 행만 등록 대상이다
    const filledSelections = currentSelections.filter((sel) => sel.player_id && sel.position_id);
    const result = adminMatchLineupBulkSchema.safeParse(filledSelections);

    if (!result.success) {
      toast({ content: result.error.issues[0].message });
      return;
    }

    await bulkCreateLineups({
      match_id: matchId,
      lineups: result.data,
    });
    handleClose();
  };

  const handleClose = () => {
    setSelections(
      Array.from({ length: 11 }, () => ({
        player_id: "",
        position_id: "",
        is_captain: false,
      })),
    );
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">스타팅 명단등록</h2>
      <div className="flex flex-col gap-4">
        {selections.map((selection, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-yds-b1 text-primary-100">선수 {index + 1}</span>
              <CheckBox
                checked={selection.is_captain}
                onCheckedChange={(checked) => handleCaptainChange(index, checked)}
                value="주장"
                shape="square"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-yds-b2 text-primary-100 mb-1 block">선수 *</label>
                <SelectBox size="full" selectBoxHook={selectBoxHooks[index].playerHook} />
              </div>
              <div>
                <label className="text-yds-b2 text-primary-100 mb-1 block">포지션 *</label>
                <SelectBox size="full" selectBoxHook={selectBoxHooks[index].positionHook} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleBulkCreate} disabled={isCreating}>
          {isCreating ? "추가 중..." : "일괄 추가"}
        </Button>
      </div>
    </div>
  );
};
