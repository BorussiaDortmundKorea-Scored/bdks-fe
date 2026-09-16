/**
 * 작성자: KYD
 * 기능: 라인업 교체 모달 컴포넌트
 * 프로세스 설명: 라인업 교체 폼을 모달로 표시. 실패 사유는 toast 대신 해당 입력 밑에 붙인다
 */
import { useState } from "react";

import { Button, Field, NumberInput, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useSubstituteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-substitute-match-lineup";
import { useLineupPlayerOptions } from "@admin/admin-match/admin-match-lineup/hooks/use-lineup-player-options";
import {
  type IAdminMatchLineupSubstitutionValues,
  MATCH_MINUTE_MAX,
  MATCH_MINUTE_MIN,
  adminMatchLineupSubstitutionSchema,
} from "@admin/admin-match/admin-match-lineup/schemas/admin-match-lineup-schema";

import { toFieldErrors } from "@shared/hooks/use-zod-form";

interface IAdminMatchLineupSubstitutionModal {
  matchId: string;
  lineup: IMatchLineup;
  onClose: () => void;
}

export const AdminMatchLineupSubstitutionModal = ({ matchId, lineup, onClose }: IAdminMatchLineupSubstitutionModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { mutateAsync: substituteLineup, isPending: isSubstituting } = useSubstituteMatchLineup(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [substitutionMinuteInput, setSubstitutionMinuteInput] = useState<number | "">("");
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminMatchLineupSubstitutionValues, string>>>({});
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  const playerOptions = useLineupPlayerOptions(players);

  const substitutionBenchPlayerHook = useSelectBox({
    options: playerOptions,
    search: true,
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const handleConfirmSubstitution = async () => {
    const result = adminMatchLineupSubstitutionSchema.safeParse({
      partner_player_id: substitutionBenchPlayerHook.label ?? "",
      substitution_minute: substitutionMinuteInput === "" ? undefined : substitutionMinuteInput,
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminMatchLineupSubstitutionValues>(result.error));
      return;
    }
    setErrors({});

    await substituteLineup({
      lineup_id: lineup.id,
      substitution_minute: result.data.substitution_minute,
      partner_player_id: result.data.partner_player_id,
    });

    handleClose();
  };

  const handleClose = () => {
    setSubstitutionMinuteInput("");
    setErrors({});
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">선수 교체</h2>
      <p className="text-primary-200 text-sm">{lineup.player_korean_name || lineup.player_name} 선수를 교체합니다.</p>
      <Field label="교체로 들어올 선수" required error={errors.partner_player_id}>
        <SelectBox size="full" selectBoxHook={substitutionBenchPlayerHook} />
      </Field>
      <Field label="교체 시간 (분)" required error={errors.substitution_minute}>
        <NumberInput
          min={MATCH_MINUTE_MIN}
          max={MATCH_MINUTE_MAX}
          value={substitutionMinuteInput === "" ? "" : String(substitutionMinuteInput)}
          onValueChange={(value: string) => setSubstitutionMinuteInput(value === "" ? "" : Number(value))}
          size="full"
          align="left"
          placeholder="예: 67"
        />
      </Field>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="fill"
          color="primary"
          size="full"
          onClick={handleConfirmSubstitution}
          disabled={isSubstituting}
        >
          {isSubstituting ? "교체 적용 중..." : "교체 적용"}
        </Button>
      </div>
    </div>
  );
};
