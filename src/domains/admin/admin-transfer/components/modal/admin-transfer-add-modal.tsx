/**
 * 작성자: KYD
 * 기능: 이적 추가 모달
 * 프로세스 설명: 선수·방향·유형·상대클럽·이적일을 선택해 이적 등록.
 *                값의 원천이 SelectBox 훅이라 제출 직전에 payload 를 조립해 한 번 검증한다
 */
import { useMemo, useState } from "react";

import { Button, DatePicker, Field, NumberInput, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useGetAllPlayersSuspense } from "@admin/admin-player/api/react-query-api/use-get-all-players-suspense";
import { useGetAllTeamsSuspense } from "@admin/admin-team/api/react-query-api/use-get-all-teams-suspense";
import { useCreateTransfer } from "@admin/admin-transfer/api/react-query-api/use-create-transfer";
import { TRANSFER_DIRECTION_OPTIONS, TRANSFER_TYPE_OPTIONS } from "@admin/admin-transfer/constants/transfer-options";
import {
  type IAdminTransferFormValues,
  adminTransferFormSchema,
} from "@admin/admin-transfer/schemas/admin-transfer-schema";

import { toFieldErrors } from "@shared/hooks/use-zod-form";
import { type TransferDirection, type TransferType } from "@shared/types/entities/transfer.entity";

interface IAdminTransferAddModal {
  onClose: () => void;
}

export const AdminTransferAddModal = ({ onClose }: IAdminTransferAddModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: teams } = useGetAllTeamsSuspense();
  const { mutateAsync: createTransfer, isPending: isCreating } = useCreateTransfer();

  const playerOptions = useMemo(
    () => players.map((player) => ({ label: player.id, value: player.korean_name ?? player.name })),
    [players],
  );
  const teamOptions = useMemo(() => teams.map((team) => ({ label: team.id, value: team.name })), [teams]);

  const playerHook = useSelectBox({ options: playerOptions, search: true });
  const directionHook = useSelectBox({ options: TRANSFER_DIRECTION_OPTIONS });
  const typeHook = useSelectBox({ options: TRANSFER_TYPE_OPTIONS });
  const teamHook = useSelectBox({ options: teamOptions, search: true });
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [transferDate, setTransferDate] = useState("");
  const [euroFee, setEuroFee] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminTransferFormValues, string>>>({});
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleCreateTransfer = async () => {
    const result = adminTransferFormSchema.safeParse({
      player_id: playerHook.label,
      direction: directionHook.label,
      transfer_type: typeHook.label,
      counterpart_team_id: teamHook.label || null,
      transfer_date: transferDate || null,
      euro_fee: euroFee === "" ? null : Number(euroFee),
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminTransferFormValues>(result.error));
      return;
    }
    setErrors({});

    await createTransfer({
      ...result.data,
      direction: result.data.direction as TransferDirection,
      transfer_type: result.data.transfer_type as TransferType,
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 이적 추가</h2>
      <div className="space-y-4">
        <Field label="선수" required error={errors.player_id}>
          <SelectBox size="full" selectBoxHook={playerHook} label="선수 선택" />
        </Field>
        <Field label="방향" required error={errors.direction}>
          <SelectBox size="full" selectBoxHook={directionHook} label="영입/방출 선택" />
        </Field>
        <Field label="유형" required error={errors.transfer_type}>
          <SelectBox size="full" selectBoxHook={typeHook} label="완전/임대 선택" />
        </Field>
        <Field label="상대 클럽" error={errors.counterpart_team_id}>
          <SelectBox size="full" selectBoxHook={teamHook} label="상대 클럽 선택 (자유계약·유스는 비움)" />
        </Field>
        <Field label="이적일" error={errors.transfer_date}>
          <DatePicker value={transferDate} onValueChange={setTransferDate} size="full" placeholder="이적일 선택" />
        </Field>
        <Field label="이적금액 (유로, 순수 금액)" error={errors.euro_fee}>
          <NumberInput
            value={euroFee}
            onValueChange={setEuroFee}
            placeholder="예: 30000000 (= 30M €)"
            size="full"
            min={0}
            suffix="€"
          />
        </Field>
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleCreateTransfer} disabled={isCreating}>
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};
