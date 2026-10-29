/**
 * 작성자: KYD
 * 기능: 보드에서 선수를 눌렀을 때 뜨는 선수 모달
 * 프로세스 설명: 위쪽은 "저장" 한 번으로 반영되는 폼이다.
 *              - 경기 기록: 골·도움(숫자 입력), 경고(0/1/2 라디오), 퇴장(체크 + 분)
 *              - 자리: 그라운드 선수는 포메이션 자리를 고를 수 있고, 그 자리에 누가 있으면 서로 맞바꾼다
 *              - 주장: 선발만 체크박스로 지정·해제
 *              아래쪽 "다른 작업"은 다른 모달로 넘어가거나(교체·상세 수정) 확인을 받고 바로 반영된다(자리 비우기·명단 삭제).
 *              항목은 선수 상태에 맞는 것만 보인다 (그라운드에 있어야 교체·자리, 선발이어야 주장·자리 비우기 등).
 *
 *              저장 순서: 자리 → 기록 → 주장. 기록 저장(update_match_lineup)은 position_id 를 함께 보내므로
 *              새 자리를 넣어 보내야 방금 옮긴 자리로 되돌아가지 않는다. 주장 저장도 같은 이유로 자리 변경을 덮어쓴 선발로 만든다.
 */
import { useMemo, useState } from "react";

import { Button, CheckBox, Chips, Field, NumberInput, SelectBox, Tabs, useSelectBox } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useDeleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { useSaveMatchOnPitchPositions } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-on-pitch-positions";
import { useSaveMatchStartingLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-starting-lineup";
import { useUpdateMatchLineup } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup";
import {
  type IAdminMatchLineupFormValues,
  MATCH_MINUTE_MAX,
  MATCH_MINUTE_MIN,
  MAX_YELLOW_CARDS,
  adminMatchLineupFormSchema,
} from "@admin/admin-match/admin-match-lineup/schemas/admin-match-lineup-schema";
import {
  type IBoardSlot,
  applyPositionChanges,
  buildLineupBoard,
  isOnPitch,
  isUnusedBench,
  moveOnPitchPlayer,
  removeStarter,
  setCaptain,
} from "@admin/admin-match/admin-match-lineup/utils/lineup-board-utils";

import ModalFooter from "@shared/components/modal/modal-footer";
import ModalTitle from "@shared/components/modal/modal-title";
import { type Formation } from "@shared/constants/formation-slots";
import { toFieldErrors } from "@shared/hooks/use-zod-form";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const YELLOW_CARD_OPTIONS = Array.from({ length: MAX_YELLOW_CARDS + 1 }, (_, count) => ({
  label: count === 0 ? "없음" : `${count}장`,
  value: String(count),
}));
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

interface IAdminMatchLineupPlayerActionModalProps {
  matchId: string;
  lineup: IMatchLineup;
  /** 포메이션이 없으면 자리 관련 항목(자리·주장·자리 비우기)을 숨긴다 */
  formation: Formation | null;
  onClose: () => void;
  /** 이 모달을 닫고 교체 모달을 연다 */
  onOpenSubstitution: () => void;
  /** 이 모달을 닫고 상세 수정 모달을 연다 */
  onOpenEditDetail: () => void;
}

const getLineupName = (lineup: IMatchLineup) => lineup.player_korean_name || lineup.player_name;

export const AdminMatchLineupPlayerActionModal = ({
  matchId,
  lineup,
  formation,
  onClose,
  onOpenSubstitution,
  onOpenEditDetail,
}: IAdminMatchLineupPlayerActionModalProps) => {
  //SECTION HOOK호출 영역
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { data: positions } = useGetAllPositionsSuspense();
  const { mutateAsync: updateLineup } = useUpdateMatchLineup(matchId);
  const { mutateAsync: saveStartingLineup } = useSaveMatchStartingLineup(matchId);
  const { mutateAsync: saveOnPitchPositions } = useSaveMatchOnPitchPositions(matchId, { silent: true });
  const { mutateAsync: deleteLineup } = useDeleteMatchLineup(matchId);
  const { confirmDialog } = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const name = getLineupName(lineup);
  const isStarter = lineup.lineup_type === "STARTING";
  const onPitch = isOnPitch(lineup);
  const canMoveSlot = onPitch && formation !== null;
  const canCaptain = isStarter && formation !== null;
  const canClearSlot = canCaptain && lineup.sub_out_minute === null;

  const [stats, setStats] = useState({
    goals: lineup.goals ?? 0,
    assists: lineup.assists ?? 0,
    yellow_cards: lineup.yellow_cards ?? 0,
    is_sent_off: lineup.is_sent_off ?? false,
    red_card_minute: lineup.red_card_minute,
  });
  const [isCaptain, setIsCaptain] = useState(lineup.is_captain === true);
  const [targetSlotKey, setTargetSlotKey] = useState(lineup.position_detail_name ?? "");
  const [errors, setErrors] = useState<Partial<Record<keyof IAdminMatchLineupFormValues, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  const slots = useMemo<IBoardSlot[]>(() => {
    const { slotLines } = buildLineupBoard(lineups, formation, positions);
    return slotLines ? Object.values(slotLines).flat() : [];
  }, [lineups, formation, positions]);
  const targetSlot = slots.find((slot) => slot.slotKey === targetSlotKey) ?? null;
  const isSlotChanged = canMoveSlot && targetSlot !== null && targetSlot.positionId !== lineup.position_id;
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const setStat = <TKey extends keyof typeof stats>(key: TKey, value: (typeof stats)[TKey]) => {
    setStats((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const result = adminMatchLineupFormSchema.safeParse({
      player_id: lineup.player_id,
      position_id: lineup.position_id,
      lineup_type: lineup.lineup_type,
      is_captain: lineup.is_captain ?? false,
      sub_in_minute: lineup.sub_in_minute,
      sub_in_partner_id: lineup.sub_in_partner_id,
      sub_out_minute: lineup.sub_out_minute,
      sub_out_partner_id: lineup.sub_out_partner_id,
      ...stats,
      red_card_minute: stats.is_sent_off ? stats.red_card_minute : null,
    });

    if (!result.success) {
      setErrors(toFieldErrors<IAdminMatchLineupFormValues>(result.error));
      return;
    }

    setIsSaving(true);
    try {
      const positionChanges =
        isSlotChanged && formation && targetSlot
          ? moveOnPitchPlayer(lineup, targetSlot.positionId, targetSlot.occupant)
          : [];
      if (formation && positionChanges.length > 0) {
        await saveOnPitchPositions({ match_id: matchId, formation, positions: positionChanges });
      }

      await updateLineup({
        ...lineup,
        ...result.data,
        position_id: isSlotChanged && targetSlot ? targetSlot.positionId : lineup.position_id,
      });

      if (canCaptain && isCaptain !== (lineup.is_captain === true)) {
        await saveStartingLineup({
          match_id: matchId,
          formation,
          lineups: setCaptain(applyPositionChanges(lineups, positionChanges), isCaptain ? lineup.player_id : null),
        });
      }
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearSlot = () => {
    if (!formation) return;
    confirmDialog({
      title: `${name} 선수를 자리에서 빼고 후보로 내릴까요?`,
      onConfirm: async () => {
        await saveStartingLineup({ match_id: matchId, formation, lineups: removeStarter(lineups, lineup.player_id) });
        onClose();
      },
    });
  };

  const handleDeleteFromRoster = () => {
    confirmDialog({
      title: `${name} 선수를 이 경기 명단에서 삭제할까요?`,
      onConfirm: async () => {
        await deleteLineup(lineup.id);
        onClose();
      },
    });
  };
  //!SECTION 메서드 영역

  return (
    <div className="flex flex-col gap-5">
      {/* 헤더: 이름 + 상태 칩 */}
      <div className="flex flex-col gap-2">
        <ModalTitle>{name}</ModalTitle>
        <div className="flex flex-wrap gap-1.5">
          <Chips variant="fill" color="primary">
            {lineup.position_detail_name ?? "포지션 없음"}
          </Chips>
          <Chips variant="outlined" color="primary">
            {isStarter ? "선발" : "후보"}
          </Chips>
          {lineup.sub_in_minute !== null && (
            <Chips variant="outlined" color="primary">{`${lineup.sub_in_minute}' 투입`}</Chips>
          )}
          {lineup.sub_out_minute !== null && (
            <Chips variant="outlined" color="primary">{`${lineup.sub_out_minute}' 아웃`}</Chips>
          )}
        </div>
      </div>

      {/* 경기 기록 */}
      <section className="flex flex-col gap-3" aria-label="경기 기록">
        <h3 className="text-yds-b2 text-white/70">경기 기록</h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="골" error={errors.goals}>
            <NumberInput
              min={0}
              value={String(stats.goals)}
              onValueChange={(value: string) => setStat("goals", value === "" ? 0 : Number(value))}
              suffix="골"
              size="full"
            />
          </Field>
          <Field label="도움" error={errors.assists}>
            <NumberInput
              min={0}
              value={String(stats.assists)}
              onValueChange={(value: string) => setStat("assists", value === "" ? 0 : Number(value))}
              suffix="개"
              size="full"
            />
          </Field>
        </div>
        <Field label="경고" error={errors.yellow_cards}>
          <Tabs
            options={YELLOW_CARD_OPTIONS}
            value={String(stats.yellow_cards)}
            onValueChange={(value: string) => setStat("yellow_cards", Number(value))}
            size="sm"
            aria-label="경고"
          />
        </Field>
        <div className="flex min-h-10 items-center gap-3">
          <CheckBox
            checked={stats.is_sent_off}
            onCheckedChange={(checked) => setStat("is_sent_off", checked)}
            value="퇴장"
            shape="square"
          />
          {stats.is_sent_off && (
            <div className="w-32">
              <NumberInput
                min={MATCH_MINUTE_MIN}
                max={MATCH_MINUTE_MAX}
                value={stats.red_card_minute != null ? String(stats.red_card_minute) : ""}
                onValueChange={(value: string) => setStat("red_card_minute", value === "" ? null : Number(value))}
                suffix="분"
                size="full"
                placeholder="예: 90"
                aria-label="퇴장 시간"
              />
            </div>
          )}
        </div>
        {errors.red_card_minute && (
          <p className="text-yds-c1r text-red-400" role="alert">
            {errors.red_card_minute}
          </p>
        )}
      </section>

      {/* 자리 · 주장 */}
      {(canMoveSlot || canCaptain) && (
        <section className="flex flex-col gap-3" aria-label="자리">
          <h3 className="text-yds-b2 text-white/70">자리</h3>
          {canMoveSlot && (
            <Field
              label="포메이션 자리"
              description={
                isSlotChanged && targetSlot?.occupant && targetSlot.occupant.player_id !== lineup.player_id
                  ? `${getLineupName(targetSlot.occupant)} 선수와 자리를 맞바꿔요`
                  : undefined
              }
            >
              <SlotSelect slots={slots} value={targetSlotKey} onChange={setTargetSlotKey} />
            </Field>
          )}
          {canCaptain && <CheckBox checked={isCaptain} onCheckedChange={setIsCaptain} value="주장" shape="square" />}
        </section>
      )}

      {/* 다른 작업: 다른 모달로 넘어가거나 확인 후 바로 반영 */}
      <section className="border-primary-100/10 flex flex-col gap-2 border-t pt-4" aria-label="다른 작업">
        <h3 className="text-yds-b2 text-white/70">다른 작업</h3>
        <div className="flex flex-wrap gap-2">
          {onPitch && (
            <Button variant="outlined" color="primary" size="sm" onClick={onOpenSubstitution}>
              교체
            </Button>
          )}
          {canClearSlot && (
            <Button variant="outlined" color="primary" size="sm" onClick={handleClearSlot}>
              자리 비우기
            </Button>
          )}
          {isUnusedBench(lineup) && (
            <Button variant="outlined" color="primary" size="sm" onClick={handleDeleteFromRoster}>
              명단에서 삭제
            </Button>
          )}
          <Button variant="outlined" color="primary" size="sm" onClick={onOpenEditDetail}>
            상세 수정
          </Button>
        </div>
      </section>

      <ModalFooter>
        <Button variant="outlined" color="primary" size="full" onClick={onClose}>
          닫기
        </Button>
        <Button variant="fill" color="primary" size="full" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </ModalFooter>
    </div>
  );
};

interface ISlotSelectProps {
  slots: IBoardSlot[];
  /** 고른 자리의 slotKey */
  value: string;
  onChange: (slotKey: string) => void;
}

/** yd-ui SelectBox 는 option.value 를 화면 문구·제어값으로 쓰므로, 문구에 slotKey 를 label 로 붙여 둔다 */
const SlotSelect = ({ slots, value, onChange }: ISlotSelectProps) => {
  const options = slots.map((slot) => ({
    label: slot.slotKey,
    value: slot.occupant
      ? `${slot.positionName} · ${getLineupName(slot.occupant)}`
      : `${slot.positionName} · 비어 있음`,
  }));
  const selectBoxHook = useSelectBox({
    options,
    value: options.find((option) => option.label === value)?.value ?? "",
    onChange: (_, option) => onChange(option.label),
  });

  return <SelectBox size="full" selectBoxHook={selectBoxHook} />;
};
