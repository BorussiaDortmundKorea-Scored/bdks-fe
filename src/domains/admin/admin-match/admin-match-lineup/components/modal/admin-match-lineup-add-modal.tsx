/**
 * 작성자: KYD
 * 기능: 라인업 추가 모달 컴포넌트
 * 프로세스 설명: 라인업 추가 폼을 모달로 표시
 */
import { useMemo, useState } from "react";

import { Button, Input, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useCreateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-create-match-lineup";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";

interface IAdminMatchLineupAddModal {
  matchId: string;
  onClose: () => void;
}

export const AdminMatchLineupAddModal = ({ matchId, onClose }: IAdminMatchLineupAddModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: positions } = useGetAllPositionsSuspense();
  const { mutateAsync: createLineup, isPending: isCreating } = useCreateMatchLineup(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState({
    player_id: "",
    position_id: "",
    lineup_type: "STARTING" as "STARTING" | "BENCH",
    is_captain: false,
    substitution_status: "NONE" as "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT",
    substitution_minute: null as number | null,
    substitution_partner_id: "",
    yellow_cards: 0,
    red_card_minute: null as number | null,
    is_sent_off: false,
    goals: 0,
    assists: 0,
  });
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

  const positionOptions = useMemo(
    () => positions.map((pos) => ({ label: pos.id, value: `${pos.position_detail_name} (${pos.position_code})` })),
    [positions],
  );

  const lineupTypeOptions = useMemo(
    () => [
      { label: "STARTING", value: "선발" },
      { label: "BENCH", value: "벤치" },
    ],
    [],
  );

  const substitutionStatusOptions = useMemo(
    () => [
      { label: "NONE", value: "없음" },
      { label: "SUBSTITUTED_IN", value: "교체투입" },
      { label: "SUBSTITUTED_OUT", value: "교체아웃" },
    ],
    [],
  );

  const createPlayerHook = useSelectBox({ options: playerOptions, search: true });
  const createPositionHook = useSelectBox({ options: positionOptions, search: true });
  const createLineupTypeHook = useSelectBox({ options: lineupTypeOptions, defaultValue: "선발" });
  const createSubStatusHook = useSelectBox({ options: substitutionStatusOptions, defaultValue: "없음" });
  const createSubPartnerHook = useSelectBox({ options: playerOptions, search: true });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const handleCreateLineup = async () => {
    await createLineup({
      match_id: matchId,
      player_id: (createPlayerHook.label as string) || formData.player_id,
      position_id: (createPositionHook.label as string) || undefined,
      lineup_type: (createLineupTypeHook.label as "STARTING" | "BENCH") || formData.lineup_type,
      is_captain: formData.is_captain,
      substitution_status:
        (createSubStatusHook.label as "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT") || formData.substitution_status,
      substitution_minute: formData.substitution_minute || undefined,
      substitution_partner_id: (createSubPartnerHook.label as string) || formData.substitution_partner_id || undefined,
      yellow_cards: formData.yellow_cards,
      red_card_minute: formData.red_card_minute || undefined,
      is_sent_off: formData.is_sent_off,
      goals: formData.goals,
      assists: formData.assists,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      player_id: "",
      position_id: "",
      lineup_type: "STARTING",
      is_captain: false,
      substitution_status: "NONE",
      substitution_minute: null,
      substitution_partner_id: "",
      yellow_cards: 0,
      red_card_minute: null,
      is_sent_off: false,
      goals: 0,
      assists: 0,
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 선수 추가</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-yds-b1 text-primary-100">선수 *</label>
          <SelectBox size="full" selectBoxHook={createPlayerHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">포지션</label>
          <SelectBox size="full" selectBoxHook={createPositionHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">라인업 타입 *</label>
          <SelectBox size="full" selectBoxHook={createLineupTypeHook} />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_captain}
            onChange={(e) => setFormData({ ...formData, is_captain: e.target.checked })}
            className="mr-2"
          />
          <label className="text-primary-100 text-sm">주장</label>
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">교체 상태</label>
          <SelectBox size="full" selectBoxHook={createSubStatusHook} />
        </div>
        {(createSubStatusHook.label === "SUBSTITUTED_IN" || createSubStatusHook.label === "SUBSTITUTED_OUT") && (
          <div>
            <label className="text-yds-b1 text-primary-100">교체 시간 (분)</label>
            <Input
              type="number"
              min={1}
              max={120}
              value={formData.substitution_minute || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, substitution_minute: parseInt(e.target.value) || null })
              }
              size="full"
              color="primary-100"
              placeholder="예: 67"
            />
            <div className="mt-3">
              <label className="text-yds-b1 text-primary-100">교체 대상 선수</label>
              <SelectBox size="full" selectBoxHook={createSubPartnerHook} />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-yds-b1 text-primary-100">골</label>
            <Input
              type="number"
              min={0}
              value={formData.goals}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, goals: parseInt(e.target.value) || 0 })
              }
              size="full"
              color="primary-100"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-yds-b1 text-primary-100">어시스트</label>
            <Input
              type="number"
              min={0}
              value={formData.assists}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, assists: parseInt(e.target.value) || 0 })
              }
              size="full"
              color="primary-100"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">옐로우 카드</label>
          <Input
            type="number"
            min={0}
            max={2}
            value={formData.yellow_cards}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, yellow_cards: parseInt(e.target.value) || 0 })
            }
            size="full"
            color="primary-100"
            placeholder="0"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_sent_off}
            onChange={(e) => setFormData({ ...formData, is_sent_off: e.target.checked })}
            className="mr-2"
          />
          <label className="text-primary-100 text-sm">퇴장</label>
        </div>
        {formData.is_sent_off && (
          <div>
            <label className="text-yds-b1 text-primary-100">퇴장 시간 (분)</label>
            <Input
              type="number"
              min={1}
              max={120}
              value={formData.red_card_minute || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, red_card_minute: parseInt(e.target.value) || null })
              }
              size="full"
              color="primary-100"
              placeholder="예: 90"
            />
          </div>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleCreateLineup} disabled={isCreating}>
          {isCreating ? "추가 중..." : "추가"}
        </Button>
      </div>
    </div>
  );
};

