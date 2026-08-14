/**
 * 작성자: KYD
 * 기능: 이적 수정 모달
 * 프로세스 설명: 기존 이적 기록을 선택값 기반으로 수정
 */
import { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";
import type { ITransfer } from "@admin/admin-transfer/api/admin-transfer-api";
import { useUpdateTransfer } from "@admin/admin-transfer/api/react-query-api/use-update-transfer";
import {
  TRANSFER_DIRECTION_OPTIONS,
  TRANSFER_TYPE_OPTIONS,
  directionDefaultValue,
  typeDefaultValue,
} from "@admin/admin-transfer/constants/transfer-options";

import { type TransferDirection, type TransferType } from "@shared/types/entities/transfer.entity";

interface IAdminTransferEditModal {
  transfer: ITransfer;
  onClose: () => void;
}

export const AdminTransferEditModal = ({ transfer, onClose }: IAdminTransferEditModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: updateTransfer, isPending: isUpdating } = useUpdateTransfer();

  const [transferDate, setTransferDate] = useState(transfer.transfer_date ?? "");
  const [euroFee, setEuroFee] = useState(transfer.euro_fee != null ? String(transfer.euro_fee) : "");

  const playerOptions = useMemo(
    () => players.map((player) => ({ label: player.id, value: player.korean_name ?? player.name })),
    [players],
  );
  const teamOptions = useMemo(() => teams.map((team) => ({ label: team.id, value: team.name })), [teams]);

  const playerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: transfer.player_korean_name ?? transfer.player_name,
  });
  const directionHook = useSelectBox({
    options: TRANSFER_DIRECTION_OPTIONS,
    defaultValue: directionDefaultValue(transfer.direction),
  });
  const typeHook = useSelectBox({
    options: TRANSFER_TYPE_OPTIONS,
    defaultValue: typeDefaultValue(transfer.transfer_type),
  });
  const teamHook = useSelectBox({
    options: teamOptions,
    search: true,
    defaultValue: transfer.counterpart_club_name ?? undefined,
  });
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const handleUpdateTransfer = async () => {
    await updateTransfer({
      id: transfer.id,
      player_id: playerHook.label,
      direction: directionHook.label as TransferDirection,
      transfer_type: typeHook.label as TransferType,
      counterpart_team_id: teamHook.label || null,
      transfer_date: transferDate || null,
      euro_fee: euroFee === "" ? null : Number(euroFee),
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">이적 수정</h2>
      <div className="space-y-4">
        <div>
          <label className="text-yds-b1 text-primary-100">선수 *</label>
          <SelectBox size="full" selectBoxHook={playerHook} label="선수 선택" />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">방향 *</label>
          <SelectBox size="full" selectBoxHook={directionHook} label="영입/방출 선택" />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">유형 *</label>
          <SelectBox size="full" selectBoxHook={typeHook} label="완전/임대 선택" />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">상대 클럽</label>
          <SelectBox size="full" selectBoxHook={teamHook} label="상대 클럽 선택 (자유계약·유스는 비움)" />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">이적일</label>
          <Input
            type="date"
            value={transferDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTransferDate(e.target.value)}
            size="full"
            color="primary-100"
          />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">이적금액 (유로, 순수 금액)</label>
          <Input
            type="number"
            value={euroFee}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEuroFee(e.target.value)}
            placeholder="예: 30000000 (= 30M €)"
            size="full"
            color="primary-100"
          />
        </div>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleUpdateTransfer}
          disabled={isUpdating || !playerHook.label || !directionHook.label || !typeHook.label}
        >
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
