/**
 * 작성자: KYD
 * 기능: 라인업 관리 보드 - 포메이션 위에서 선발 배치와 경기 기록을 입력
 * 프로세스 설명: 사용자 평점 화면과 같은 공용 틀(FormationBoardFrame)·카드(FormationPlayerCard)로 그린다.
 *              그래서 여기서 보이는 모습이 곧 사용자 화면의 모습이다. 차이는 평점 배지가 없고,
 *              빈 자리(FormationEmptySlotCard)가 있고, 카드가 링크 대신 버튼이라는 것뿐이다.
 *              선발 탭: 빈 자리를 누르면 선수 배치, 선수를 누르면 선수 액션(골·도움·카드·교체 등) 모달.
 *              교체 탭: 자리 없는 출전 선수 · 후보 · 교체 아웃. 후보 끝의 + 칸으로 후보를 여러 명 한 번에 추가한다.
 *              포메이션을 바꾸면 그라운드 선수는 그대로 두고 포지션만 새 자리로 옮긴다(remapOnPitchToFormation).
 *              자리 배치와 포메이션 변경은 누르는 즉시 저장한다. 편집 중 상태를 두지 않고 서버 라인업을 그대로 그린다.
 */
import { useMemo, useState } from "react";

import { SelectBox, useSelectBox } from "@youngduck/yd-ui";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { useGetAllPlayersSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense";
import { useGetAllPositionsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense";
import { useGetMatchLineupsSuspense } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense";
import { useSaveMatchOnPitchPositions } from "@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-on-pitch-positions";
import { AdminMatchLineupBenchAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-bench-add-modal";
import { AdminMatchLineupEditModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-edit-modal";
import { AdminMatchLineupPlayerActionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-player-action-modal";
import { AdminMatchLineupSlotPickerModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-slot-picker-modal";
import { AdminMatchLineupSubstitutionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-substitution-modal";
import { STARTING_LINEUP_SIZE } from "@admin/admin-match/admin-match-lineup/schemas/admin-match-lineup-schema";
import {
  type IBoardSlot,
  buildLineupBoard,
  remapOnPitchToFormation,
} from "@admin/admin-match/admin-match-lineup/utils/lineup-board-utils";
import { type IMatch } from "@admin/admin-match/api/admin-match-api";

import FormationBoardFrame from "@shared/components/match/formation/formation-board-frame";
import FormationEmptySlotCard from "@shared/components/match/formation/formation-empty-slot-card";
import FormationLineLayout from "@shared/components/match/formation/formation-line-layout";
import FormationPlayerCard from "@shared/components/match/formation/formation-player-card";
import FormationPlayerGroup from "@shared/components/match/formation/formation-player-group";
import { type FormationViewType, type IFormationPlayer } from "@shared/components/match/formation/formation-types";
import { MODAL_SLOT_CONFIG } from "@shared/components/modal/modal-slot-config";
import { FORMATION_OPTIONS, isFormation } from "@shared/constants/formation-slots";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const FORMATION_SELECT_OPTIONS = FORMATION_OPTIONS.map((formation) => ({ label: formation, value: formation }));
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

/** 사용자 화면 카드 모양으로 맞춘다. rating 을 넘기지 않아 평점 배지는 그리지 않는다 */
const toFormationPlayer = (lineup: IMatchLineup, imageUrl: string | null | undefined): IFormationPlayer => ({
  playerId: lineup.player_id,
  name: lineup.player_korean_name || lineup.player_name,
  imageUrl: imageUrl ?? "",
  isCaptain: lineup.is_captain === true,
  goals: lineup.goals ?? 0,
  assists: lineup.assists ?? 0,
  yellowCards: lineup.yellow_cards ?? 0,
  isSentOff: lineup.is_sent_off === true,
  subInMinute: lineup.sub_in_minute,
  subOutMinute: lineup.sub_out_minute,
});

interface IAdminMatchLineupBoardProps {
  matchId: string;
  /** 헤더 경기정보 + 저장된 포메이션(matches.formation, 자유 문자열이라 상수에 없는 값일 수 있다) */
  match: IMatch | undefined;
}

const AdminMatchLineupBoard = ({ matchId, match }: IAdminMatchLineupBoardProps) => {
  //SECTION HOOK호출 영역
  const { data: lineups } = useGetMatchLineupsSuspense(matchId);
  const { data: players } = useGetAllPlayersSuspense();
  const { data: positions } = useGetAllPositionsSuspense();
  const { mutate: saveOnPitchPositions } = useSaveMatchOnPitchPositions(matchId);
  const overlay = useOverlay();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const [viewType, setViewType] = useState<FormationViewType>("PLAY");
  const savedFormation = match?.formation ?? null;
  const formation = isFormation(savedFormation) ? savedFormation : null;
  const board = useMemo(() => buildLineupBoard(lineups, formation, positions), [lineups, formation, positions]);
  const imageByPlayerId = useMemo(
    () => new Map(players.map((player) => [player.id, player.head_profile_image_url])),
    [players],
  );
  const seatedCount = board.slotLines
    ? Object.values(board.slotLines)
        .flat()
        .filter((slot) => slot.occupant).length
    : 0;
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  // 그라운드 선수는 그대로 두고 포지션만 새 포메이션 자리로 옮긴다 (선발/후보·기록은 그대로)
  const handleChangeFormation = (value: string) => {
    if (!isFormation(value) || value === formation) return;
    saveOnPitchPositions({
      match_id: matchId,
      formation: value,
      positions: remapOnPitchToFormation(lineups, value, positions),
    });
  };

  const handleOpenBenchAddModal = () => {
    overlay.modalOpen({
      content: (onClose) => <AdminMatchLineupBenchAddModal matchId={matchId} onClose={onClose} />,
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenSlotPicker = (slot: IBoardSlot) => {
    if (!formation) return;
    overlay.modalOpen({
      content: (onClose) => (
        <AdminMatchLineupSlotPickerModal
          matchId={matchId}
          formation={formation}
          positionId={slot.positionId}
          positionName={slot.positionName}
          onClose={onClose}
        />
      ),
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };

  const handleOpenPlayerAction = (lineup: IMatchLineup) => {
    overlay.modalOpen({
      content: (onClose) => (
        <AdminMatchLineupPlayerActionModal
          matchId={matchId}
          lineup={lineup}
          formation={formation}
          onClose={onClose}
          onOpenSubstitution={() => {
            onClose();
            overlay.modalOpen({
              content: (close) => (
                <AdminMatchLineupSubstitutionModal matchId={matchId} lineup={lineup} onClose={close} />
              ),
              config: { size: "sm", ...MODAL_SLOT_CONFIG },
            });
          }}
          onOpenEditDetail={() => {
            onClose();
            overlay.modalOpen({
              content: (close) => <AdminMatchLineupEditModal matchId={matchId} lineup={lineup} onClose={close} />,
              config: { size: "sm", ...MODAL_SLOT_CONFIG },
            });
          }}
        />
      ),
      config: { size: "sm", ...MODAL_SLOT_CONFIG },
    });
  };
  const renderPlayer = (lineup: IMatchLineup) => (
    <FormationPlayerCard
      key={lineup.id}
      player={toFormationPlayer(lineup, imageByPlayerId.get(lineup.player_id))}
      onClick={() => handleOpenPlayerAction(lineup)}
    />
  );
  //!SECTION 메서드 영역

  return (
    <div className="flex w-full max-w-[480px] flex-col gap-2">
      {savedFormation && !formation && (
        <p className="text-yds-c1r text-yellow-500" role="alert">
          저장된 포메이션 "{savedFormation}" 은 목록에 없어요. 다시 골라주세요
        </p>
      )}
      {board.missingPositions.length > 0 && (
        <p className="text-yds-c1r text-red-400" role="alert">
          포지션 데이터에 없는 자리가 있어요: {board.missingPositions.join(", ")}
        </p>
      )}
      {board.unplaced.length > 0 && viewType === "PLAY" && (
        <p className="text-yds-c1r text-yellow-500" role="alert">
          자리 없는 출전 선수 {board.unplaced.length}명이 있어요. 교체 탭에서 확인하세요
        </p>
      )}

      <FormationBoardFrame
        title={
          match ? `도르트문트(${match.home_away === "HOME" ? "H" : "A"}) vs ${match.opponent_team_name}` : "라인업"
        }
        subtitle={match ? [match.match_date, match.competition_name, match.round_name].filter(Boolean).join(" ") : ""}
        headerRight={
          <div className="flex shrink-0 flex-col items-end gap-1">
            <FormationSelect value={formation ?? ""} onChange={handleChangeFormation} />
            {formation && (
              <span className="text-yds-c1m text-primary-100" aria-label="배치 인원">
                {seatedCount} / {STARTING_LINEUP_SIZE}
              </span>
            )}
          </div>
        }
        viewType={viewType}
        onViewTypeChange={setViewType}
      >
        {/* 선발: 포메이션 자리 (빈 자리 = 선수 배치, 선수 = 액션 모달) */}
        {viewType === "PLAY" &&
          (board.slotLines ? (
            <FormationLineLayout
              lines={board.slotLines}
              getItemKey={(slot) => slot.slotKey}
              renderItem={(slot) =>
                slot.occupant ? (
                  renderPlayer(slot.occupant)
                ) : (
                  <FormationEmptySlotCard label={slot.positionName} onClick={() => handleOpenSlotPicker(slot)} />
                )
              }
            />
          ) : (
            <div className="text-yds-b2 flex flex-1 items-center justify-center text-white/70">
              오른쪽 위에서 포메이션을 고르면 자리가 나타나요
            </div>
          ))}

        {/* 교체: 자리 없는 출전 선수 · 후보 · 교체 아웃 */}
        {viewType === "NOT_PLAY" && (
          <div className="flex h-auto w-full flex-1 flex-col gap-4 overflow-y-auto py-4">
            {board.unplaced.length > 0 && (
              <FormationPlayerGroup
                title={`자리 없는 출전 선수 (${board.unplaced.length})`}
                description="포지션이 포메이션과 맞지 않아요. 눌러서 상세 수정하거나 자리를 비워주세요"
              >
                {board.unplaced.map(renderPlayer)}
              </FormationPlayerGroup>
            )}
            <FormationPlayerGroup title={`후보 (${board.bench.length})`}>
              {board.bench.map(renderPlayer)}
              <FormationEmptySlotCard label="후보" actionLabel="후보 선수 추가" onClick={handleOpenBenchAddModal} />
            </FormationPlayerGroup>
            <FormationPlayerGroup title={`교체 아웃 (${board.subbedOut.length})`}>
              {board.subbedOut.length > 0 ? (
                board.subbedOut.map(renderPlayer)
              ) : (
                <span className="text-yds-c1r text-white/50">아직 교체가 없어요</span>
              )}
            </FormationPlayerGroup>
          </div>
        )}
      </FormationBoardFrame>
    </div>
  );
};

export default AdminMatchLineupBoard;

const FormationSelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
  const selectBoxHook = useSelectBox({ options: FORMATION_SELECT_OPTIONS, value, onChange });

  return (
    <div aria-label="포메이션">
      <SelectBox size="full" selectBoxHook={selectBoxHook} />
    </div>
  );
};
