/**
 * 작성자: KYD
 * 기능: 라인업 교체 모달 컴포넌트
 * 프로세스 설명: 라인업 교체 폼을 모달로 표시
 */
import { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useSubstituteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-substitute-match-lineup";

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
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  const playerOptions = useMemo(
    () =>
      players.map((p) => ({
        label: p.id,
        value: `${p.korean_name || p.name}${p.jersey_number ? ` (${p.jersey_number}번)` : ""}`,
      })),
    [players],
  );

  const substitutionBenchPlayerHook = useSelectBox({
    options: playerOptions,
    search: true,
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const handleConfirmSubstitution = async () => {
    if (!substitutionMinuteInput || substitutionMinuteInput < 1 || substitutionMinuteInput > 120) {
      alert("교체 시간은 1분 이상 120분 이하로 입력해주세요.");
      return;
    }

    const partnerPlayerId = substitutionBenchPlayerHook.label as string | undefined;
    if (!partnerPlayerId) {
      alert("교체로 들어올 선수를 선택해주세요.");
      return;
    }

    await substituteLineup({
      lineup_id: lineup.id,
      substitution_minute: substitutionMinuteInput,
      partner_player_id: partnerPlayerId,
    });

    handleClose();
  };

  const handleClose = () => {
    setSubstitutionMinuteInput("");
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">선수 교체</h2>
      <p className="text-primary-200 text-sm">{lineup.player_korean_name || lineup.player_name} 선수를 교체합니다.</p>
      <div>
        <label className="text-yds-b1 text-primary-100">교체로 들어올 선수 *</label>
        <SelectBox size="full" selectBoxHook={substitutionBenchPlayerHook} />
      </div>
      <div>
        <label className="text-yds-b1 text-primary-100">교체 시간 (분)</label>
        <Input
          type="number"
          min={1}
          max={120}
          value={substitutionMinuteInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSubstitutionMinuteInput(e.target.value === "" ? "" : parseInt(e.target.value) || "")
          }
          size="full"
          color="primary-100"
          placeholder="예: 67"
        />
      </div>
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

