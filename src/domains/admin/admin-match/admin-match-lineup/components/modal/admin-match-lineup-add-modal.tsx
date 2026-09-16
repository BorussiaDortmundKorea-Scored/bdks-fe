/**
 * 작성자: KYD
 * 기능: 라인업 추가 모달 컴포넌트
 * 프로세스 설명: 라인업 추가 폼을 모달로 표시.
 *                선수·포지션은 SelectBox 훅이 값의 원천이라 제출 직전에 payload 를 조립해 검증한다
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, Field, NumberInput, SelectBox, useSelectBox } from "@youngduck/yd-ui";

import { useCreateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-create-match-lineup";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
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

interface IAdminMatchLineupAddModal {
  matchId: string;
  onClose: () => void;
}

/** 초기값을 두 곳에 적어두면 한쪽만 고쳐져 폼이 어긋난다 */
const INITIAL_STATS = {
  is_captain: false,
  sub_in_minute: null as number | null,
  sub_out_minute: null as number | null,
  yellow_cards: 0,
  red_card_minute: null as number | null,
  is_sent_off: false,
  goals: 0,
  assists: 0,
};

export const AdminMatchLineupAddModal = ({ matchId, onClose }: IAdminMatchLineupAddModal) => {
  //SECTION HOOK호출 영역
  const { data: players } = useGetAllPlayersSuspense();
  const { data: positions } = useGetAllPositionsSuspense();
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { mutateAsync: createLineup, isPending: isCreating } = useCreateMatchLineup(matchId);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [stats, setStats] = useState(INITIAL_STATS);
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminMatchLineupFormValues, string>>>({});
  //!SECTION 상태값 영역

  //SECTION SelectBox 옵션/훅
  // 교체 파트너는 이미 명단에 올라간 선수를 지목하는 자리라 전체 목록을 그대로 쓴다
  const playerOptions = useLineupPlayerOptions(players);
  // 추가할 선수는 이미 이 경기 명단에 있는 선수를 빼고 보여준다
  const addablePlayerOptions = useLineupPlayerOptions(players, lineups);

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

  const createPlayerHook = useSelectBox({ options: addablePlayerOptions, search: true });
  const createPositionHook = useSelectBox({ options: positionOptions, search: true });
  const createLineupTypeHook = useSelectBox({ options: lineupTypeOptions, defaultValue: "선발" });
  const createSubInPartnerHook = useSelectBox({ options: playerOptions, search: true });
  const createSubOutPartnerHook = useSelectBox({ options: playerOptions, search: true });
  //!SECTION SelectBox 옵션/훅

  //SECTION 메서드 영역
  const setStat = <TKey extends keyof typeof INITIAL_STATS>(key: TKey, value: (typeof INITIAL_STATS)[TKey]) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateLineup = async () => {
    const result = adminMatchLineupFormSchema.safeParse({
      ...stats,
      player_id: createPlayerHook.label ?? "",
      position_id: createPositionHook.label || null,
      lineup_type: createLineupTypeHook.label || "STARTING",
      sub_in_partner_id: createSubInPartnerHook.label || null,
      sub_out_partner_id: createSubOutPartnerHook.label || null,
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminMatchLineupFormValues>(result.error));
      return;
    }
    setErrors({});

    await createLineup({
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
    handleClose();
  };

  const handleClose = () => {
    setStats(INITIAL_STATS);
    setErrors({});
    onClose();
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-yds-b1 text-primary-100">새 선수 추가</h2>
      <div className="flex flex-col gap-4">
        <Field label="선수" required error={errors.player_id}>
          <SelectBox size="full" selectBoxHook={createPlayerHook} />
          {addablePlayerOptions.length === 0 && (
            <p className="text-yds-c1m text-primary-100 mt-1">
              추가할 수 있는 선수가 없습니다. 이미 모든 선수가 이 경기 명단에 있습니다.
            </p>
          )}
        </Field>
        <Field label="포지션" error={errors.position_id}>
          <SelectBox size="full" selectBoxHook={createPositionHook} />
        </Field>
        <Field label="라인업 타입" required error={errors.lineup_type}>
          <SelectBox size="full" selectBoxHook={createLineupTypeHook} />
        </Field>
        <CheckBox
          checked={stats.is_captain}
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
          <SelectBox size="full" selectBoxHook={createSubInPartnerHook} />
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
          <SelectBox size="full" selectBoxHook={createSubOutPartnerHook} />
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
          checked={stats.is_sent_off}
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
