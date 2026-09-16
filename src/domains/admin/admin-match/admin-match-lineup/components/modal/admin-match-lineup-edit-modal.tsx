/**
 * 작성자: KYD
 * 기능: 라인업 수정 모달 컴포넌트
 * 프로세스 설명: 라인업 수정 폼을 모달로 표시.
 *                선수·포지션은 SelectBox 훅이 값의 원천이라 제출 직전에 payload 를 조립해 검증한다
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, Field, NumberInput, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useUpdateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup";
import { useLineupPlayerOptions } from "@admin/admin-match/admin-match-lineup/hooks/use-lineup-player-options";
import {
  type IAdminMatchLineupFormValues,
  MATCH_MINUTE_MAX,
  MATCH_MINUTE_MIN,
  MAX_YELLOW_CARDS,
  adminMatchLineupFormSchema,
} from "@admin/admin-match/admin-match-lineup/schemas/admin-match-lineup-schema";

import { toFieldErrors } from "@shared/hooks/use-zod-form";
import { type LineupType } from "@shared/types/match-lineup.types";

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
  // 모달은 행마다 새로 마운트되므로 초기값을 props 에서 바로 만든다
  const [stats, setStats] = useState({
    is_captain: lineup.is_captain,
    sub_in_minute: lineup.sub_in_minute,
    sub_out_minute: lineup.sub_out_minute,
    yellow_cards: lineup.yellow_cards,
    red_card_minute: lineup.red_card_minute,
    is_sent_off: lineup.is_sent_off,
    goals: lineup.goals,
    assists: lineup.assists,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminMatchLineupFormValues, string>>>({});
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  const playerOptions = useLineupPlayerOptions(players);

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

  const getPlayerValueById = (id: string) => playerOptions.find((o) => o.label === id)?.value;
  const getPositionValueById = (id: string) => positionOptions.find((o) => o.label === id)?.value;

  const editPlayerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: getPlayerValueById(lineup.player_id),
  });
  const editPositionHook = useSelectBox({
    options: positionOptions,
    search: true,
    defaultValue: lineup.position_id ? getPositionValueById(lineup.position_id) : undefined,
  });
  const editLineupTypeHook = useSelectBox({
    options: lineupTypeOptions,
    defaultValue: lineup.lineup_type === "STARTING" ? "선발" : "벤치",
  });
  const editSubInPartnerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: lineup.sub_in_partner_id ? getPlayerValueById(lineup.sub_in_partner_id) : undefined,
  });
  const editSubOutPartnerHook = useSelectBox({
    options: playerOptions,
    search: true,
    defaultValue: lineup.sub_out_partner_id ? getPlayerValueById(lineup.sub_out_partner_id) : undefined,
  });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const setStat = <TKey extends keyof typeof stats>(key: TKey, value: (typeof stats)[TKey]) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateLineup = async () => {
    const result = adminMatchLineupFormSchema.safeParse({
      ...stats,
      player_id: editPlayerHook.label || lineup.player_id,
      position_id: editPositionHook.label || lineup.position_id || null,
      lineup_type: editLineupTypeHook.label || lineup.lineup_type,
      sub_in_partner_id: editSubInPartnerHook.label || null,
      sub_out_partner_id: editSubOutPartnerHook.label || null,
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminMatchLineupFormValues>(result.error));
      return;
    }
    setErrors({});

    await updateLineup({
      id: lineup.id,
      match_id: matchId,
      player_id: result.data.player_id,
      position_id: result.data.position_id ?? undefined,
      lineup_type: result.data.lineup_type as LineupType,
      is_captain: result.data.is_captain,
      sub_in_minute: result.data.sub_in_minute,
      sub_in_partner_id: result.data.sub_in_partner_id,
      sub_out_minute: result.data.sub_out_minute,
      sub_out_partner_id: result.data.sub_out_partner_id,
      yellow_cards: result.data.yellow_cards,
      red_card_minute: result.data.red_card_minute ?? undefined,
      is_sent_off: result.data.is_sent_off,
      goals: result.data.goals,
      assists: result.data.assists,
    });
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">라인업 수정</h2>
      <div className="flex flex-col gap-4">
        <Field label="선수" required error={errors.player_id}>
          <SelectBox size="full" selectBoxHook={editPlayerHook} />
        </Field>
        <Field label="포지션" error={errors.position_id}>
          <SelectBox size="full" selectBoxHook={editPositionHook} />
        </Field>
        <Field label="라인업 타입" required error={errors.lineup_type}>
          <SelectBox size="full" selectBoxHook={editLineupTypeHook} />
        </Field>
        <CheckBox
          checked={stats.is_captain || false}
          onCheckedChange={(checked) => setStat("is_captain", checked)}
          value="주장"
          shape="square"
        />
        {/* 교체는 투입/아웃 두 시점을 각각 입력한다. 비워두면 해당 교체가 없는 것 */}
        <Field label="교체 투입 시간 (분)" error={errors.sub_in_minute}>
          <NumberInput
            min={MATCH_MINUTE_MIN}
            max={MATCH_MINUTE_MAX}
            value={stats.sub_in_minute != null ? String(stats.sub_in_minute) : ""}
            onValueChange={(value: string) => setStat("sub_in_minute", value === "" ? null : Number(value))}
            size="full"
            align="left"
            placeholder="예: 27"
          />
        </Field>
        <Field label="대신 들어간 선수" error={errors.sub_in_partner_id}>
          <SelectBox size="full" selectBoxHook={editSubInPartnerHook} />
        </Field>
        <Field label="교체 아웃 시간 (분)" error={errors.sub_out_minute}>
          <NumberInput
            min={MATCH_MINUTE_MIN}
            max={MATCH_MINUTE_MAX}
            value={stats.sub_out_minute != null ? String(stats.sub_out_minute) : ""}
            onValueChange={(value: string) => setStat("sub_out_minute", value === "" ? null : Number(value))}
            size="full"
            align="left"
            placeholder="예: 82"
          />
        </Field>
        <Field label="대신 들어온 선수" error={errors.sub_out_partner_id}>
          <SelectBox size="full" selectBoxHook={editSubOutPartnerHook} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="골" error={errors.goals}>
            <NumberInput
              min={0}
              value={String(stats.goals)}
              onValueChange={(value: string) => setStat("goals", value === "" ? 0 : Number(value))}
              size="full"
              align="left"
              placeholder="0"
            />
          </Field>
          <Field label="어시스트" error={errors.assists}>
            <NumberInput
              min={0}
              value={String(stats.assists)}
              onValueChange={(value: string) => setStat("assists", value === "" ? 0 : Number(value))}
              size="full"
              align="left"
              placeholder="0"
            />
          </Field>
        </div>
        <Field label="옐로우 카드" error={errors.yellow_cards}>
          <NumberInput
            min={0}
            max={MAX_YELLOW_CARDS}
            value={String(stats.yellow_cards)}
            onValueChange={(value: string) => setStat("yellow_cards", value === "" ? 0 : Number(value))}
            size="full"
            align="left"
            placeholder="0"
          />
        </Field>
        <CheckBox
          checked={stats.is_sent_off || false}
          onCheckedChange={(checked) => setStat("is_sent_off", checked)}
          value="퇴장"
          shape="square"
        />
        {stats.is_sent_off && (
          <Field label="퇴장 시간 (분)" required error={errors.red_card_minute}>
            <NumberInput
              min={MATCH_MINUTE_MIN}
              max={MATCH_MINUTE_MAX}
              value={stats.red_card_minute != null ? String(stats.red_card_minute) : ""}
              onValueChange={(value: string) => setStat("red_card_minute", value === "" ? null : Number(value))}
              size="full"
              align="left"
              placeholder="예: 90"
            />
          </Field>
        )}
      </div>
      <div className="mt-6 flex gap-2">
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          취소
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleUpdateLineup} disabled={isUpdating}>
          {isUpdating ? "수정 중..." : "수정"}
        </Button>
      </div>
    </div>
  );
};
