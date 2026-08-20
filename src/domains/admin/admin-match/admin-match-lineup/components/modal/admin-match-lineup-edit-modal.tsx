/**
 * 작성자: KYD
 * 기능: 라인업 수정 모달 컴포넌트
 * 프로세스 설명: 라인업 수정 폼을 모달로 표시
 */
import { useEffect, useMemo, useState } from "react";

import { Button, CheckBox, NumberInput, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useUpdateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup";
import { type LineupType, type SubstitutionStatus } from "@shared/types/match-lineup.types";
import { type IMatchLineupEntity } from "@shared/types/entities/match-lineup.entity";

interface IAdminMatchLineupEditModal {
  matchId: string;
  lineup: IMatchLineup;
  onClose: () => void;
}

export const AdminMatchLineupEditModal = ({ matchId, lineup, onClose }: IAdminMatchLineupEditModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: positions } = useGetAllPositionsSuspense();
  const { mutateAsync: updateLineup, isPending: isUpdating } = useUpdateMatchLineup(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [formData, setFormData] = useState<Pick<IMatchLineupEntity, "player_id" | "position_id" | "lineup_type" | "is_captain" | "substitution_status" | "substitution_minute" | "substitution_partner_id" | "yellow_cards" | "red_card_minute" | "is_sent_off" | "goals" | "assists">>({
    player_id: "",
    position_id: "",
    lineup_type: "STARTING",
    is_captain: false ,
    substitution_status: "NONE",
    substitution_minute: null,
    substitution_partner_id: "",
    yellow_cards: 0,
    red_card_minute: null,
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

  const getPlayerValueById = (id: string) => playerOptions.find((o) => o.label === id)?.value;
  const getPositionValueById = (id: string) => positionOptions.find((o) => o.label === id)?.value;

  const editPlayerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: lineup ? getPlayerValueById(lineup.player_id) : undefined,
  });
  const editPositionHook = useSelectBox({
    options: positionOptions,
    search: true,
    defaultValue: lineup && lineup.position_id ? getPositionValueById(lineup.position_id) : undefined,
  });
  const editLineupTypeHook = useSelectBox({
    options: lineupTypeOptions,
    defaultValue: lineup ? (lineup.lineup_type === "STARTING" ? "선발" : "벤치") : undefined,
  });
  const editSubStatusHook = useSelectBox({
    options: substitutionStatusOptions,
    defaultValue: lineup
      ? lineup.substitution_status === "NONE"
        ? "없음"
        : lineup.substitution_status === "SUBSTITUTED_IN"
          ? "교체투입"
          : "교체아웃"
      : undefined,
  });
  const editSubPartnerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: lineup && lineup.substitution_partner_id ? getPlayerValueById(lineup.substitution_partner_id) : undefined,
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  useEffect(() => {
    setFormData({
      player_id: lineup.player_id,
      position_id: lineup.position_id || "",
      lineup_type: lineup.lineup_type,
      is_captain: lineup.is_captain,
      substitution_status: lineup.substitution_status,
      substitution_minute: lineup.substitution_minute,
      substitution_partner_id: lineup.substitution_partner_id || "",
      yellow_cards: lineup.yellow_cards,
      red_card_minute: lineup.red_card_minute,
      is_sent_off: lineup.is_sent_off,
      goals: lineup.goals,
      assists: lineup.assists,
    });
  }, [lineup]);

  const handleUpdateLineup = async () => {
    await updateLineup({
      id: lineup.id,
      match_id: matchId,
      player_id: (editPlayerHook.label as string) || formData.player_id || undefined,
      position_id: (editPositionHook.label as string) || formData.position_id || undefined,
      lineup_type: (editLineupTypeHook.label as LineupType) || formData.lineup_type,
      is_captain: formData.is_captain,
      substitution_status:
        (editSubStatusHook.label as SubstitutionStatus) || formData.substitution_status,
      substitution_minute: formData.substitution_minute || undefined,
      substitution_partner_id: (editSubPartnerHook.label as string) || formData.substitution_partner_id || undefined,
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
      <h2 className="text-yds-b1 text-primary-100">라인업 수정</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-yds-b1 text-primary-100">선수 *</label>
          <SelectBox size="full" selectBoxHook={editPlayerHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">포지션</label>
          <SelectBox size="full" selectBoxHook={editPositionHook} />
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">라인업 타입 *</label>
          <SelectBox size="full" selectBoxHook={editLineupTypeHook} />
        </div>
        <CheckBox
          checked={formData.is_captain || false}
          onCheckedChange={(checked) => setFormData({ ...formData, is_captain: checked })}
          value="주장"
          shape="square"
        />
        <div>
          <label className="text-yds-b1 text-primary-100">교체 상태</label>
          <SelectBox size="full" selectBoxHook={editSubStatusHook} />
        </div>
        {(editSubStatusHook.label === "SUBSTITUTED_IN" || editSubStatusHook.label === "SUBSTITUTED_OUT") && (
          <div>
            <label className="text-yds-b1 text-primary-100">교체 시간 (분)</label>
            <NumberInput
              min={1}
              max={120}
              value={formData.substitution_minute != null ? String(formData.substitution_minute) : ""}
              onValueChange={(value: string) =>
                setFormData({ ...formData, substitution_minute: value === "" ? null : Number(value) })
              }
              size="full"
              align="left"
              placeholder="예: 67"
            />
            <div className="mt-3">
              <label className="text-yds-b1 text-primary-100">교체 대상 선수</label>
              <SelectBox size="full" selectBoxHook={editSubPartnerHook} />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-yds-b1 text-primary-100">골</label>
            <NumberInput
              min={0}
              value={String(formData.goals)}
              onValueChange={(value: string) => setFormData({ ...formData, goals: value === "" ? 0 : Number(value) })}
              size="full"
              align="left"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-yds-b1 text-primary-100">어시스트</label>
            <NumberInput
              min={0}
              value={String(formData.assists)}
              onValueChange={(value: string) => setFormData({ ...formData, assists: value === "" ? 0 : Number(value) })}
              size="full"
              align="left"
              placeholder="0"
            />
          </div>
        </div>
        <div>
          <label className="text-yds-b1 text-primary-100">옐로우 카드</label>
          <NumberInput
            min={0}
            max={2}
            value={String(formData.yellow_cards)}
            onValueChange={(value: string) => setFormData({ ...formData, yellow_cards: value === "" ? 0 : Number(value) })}
            size="full"
            align="left"
            placeholder="0"
          />
        </div>
        <CheckBox
          checked={formData.is_sent_off || false}
          onCheckedChange={(checked) => setFormData({ ...formData, is_sent_off: checked })}
          value="퇴장"
          shape="square"
        />
        {formData.is_sent_off && (
          <div>
            <label className="text-yds-b1 text-primary-100">퇴장 시간 (분)</label>
            <NumberInput
              min={1}
              max={120}
              value={formData.red_card_minute != null ? String(formData.red_card_minute) : ""}
              onValueChange={(value: string) =>
                setFormData({ ...formData, red_card_minute: value === "" ? null : Number(value) })
              }
              size="full"
              align="left"
              placeholder="예: 90"
            />
          </div>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={handleClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleUpdateLineup} disabled={isUpdating}>
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};

