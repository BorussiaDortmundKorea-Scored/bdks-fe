/**
 * 작성자: KYD
 * 기능: 포메이션 본문 (최신경기 · 경기 평점 공용)
 * 프로세스 설명: 공용 틀(FormationBoardFrame) 안에 평점 카드로 선발/교체 명단을 그린다.
 *              두 화면의 본문이 같은 코드였어서 여기로 옮겼다. 관리자 라인업 보드는 같은 틀·카드를 쓰되
 *              빈 자리·클릭 동작이 달라 이 컴포넌트 대신 틀을 직접 조립한다.
 *
 * 1. 포메이션 렌더링 선발명단: 축구 1선,2선,3선,4선,5선 순 줄 배치는 FormationLineLayout 이 담당
 * 2. 포메이션 렌더링 후보명단: 5선 밑에 후보명단 렌더링
 */
import { type ReactNode, useState } from "react";

import FormationBoardFrame from "@shared/components/match/formation/formation-board-frame";
import FormationLineLayout from "@shared/components/match/formation/formation-line-layout";
import FormationPlayerCard from "@shared/components/match/formation/formation-player-card";
import FormationPlayerGroup from "@shared/components/match/formation/formation-player-group";
import {
  type FormationLines,
  type FormationViewType,
  type IFormationPlayer,
} from "@shared/components/match/formation/formation-types";

interface IFormationBoardProps {
  /** 헤더 좌측 1행 (예: 도르트문트(H) vs 상대) */
  title: ReactNode;
  /** 헤더 좌측 2행 (예: 시즌 리그 라운드) */
  subtitle: ReactNode;
  /** 헤더 우측 (최신경기는 진행 시간, 종료된 경기는 스코어) */
  headerRight: ReactNode;

  playingMembers: FormationLines;
  substitutedOutPlayers: IFormationPlayer[];
  unusedPlayers: IFormationPlayer[];

  /** 카드를 링크로 만들 때의 경로 생성기 */
  getPlayerLink?: (player: IFormationPlayer) => string;
  /** 미출전 선수처럼 링크를 막아야 할 때의 안내 문구 */
  unusedPlayerDisabledReason?: string;
  onDisabledPlayerClick?: (reason: string) => void;
}

const FormationBoard = ({
  title,
  subtitle,
  headerRight,
  playingMembers,
  substitutedOutPlayers,
  unusedPlayers,
  getPlayerLink,
  unusedPlayerDisabledReason,
  onDisabledPlayerClick,
}: IFormationBoardProps) => {
  //SECTION HOOK호출 영역
  const [viewType, setViewType] = useState<FormationViewType>("PLAY");
  //!SECTION HOOK호출 영역

  //SECTION 메서드 영역
  const renderPlayer = (player: IFormationPlayer, isUnused = false) => (
    <FormationPlayerCard
      key={player.playerId}
      player={player}
      to={getPlayerLink?.(player)}
      disabledReason={isUnused ? unusedPlayerDisabledReason : undefined}
      onDisabledClick={onDisabledPlayerClick}
    />
  );
  //!SECTION 메서드 영역

  return (
    <FormationBoardFrame
      title={title}
      subtitle={subtitle}
      headerRight={headerRight}
      viewType={viewType}
      onViewTypeChange={setViewType}
    >
      {/* 조건별 하단부 : 포메이션 선발 명단 렌더링 */}
      {viewType === "PLAY" && (
        <FormationLineLayout
          lines={playingMembers}
          getItemKey={(player) => player.playerId}
          renderItem={(player) => renderPlayer(player)}
        />
      )}

      {/* 조건별 하단부 : 포메이션 교체 명단 렌더링 */}
      {viewType === "NOT_PLAY" && (
        <div className="flex h-auto w-full flex-1 flex-col gap-4 overflow-y-auto py-4">
          {substitutedOutPlayers.length > 0 && (
            <FormationPlayerGroup title="교체 아웃">
              {substitutedOutPlayers.map((player) => renderPlayer(player))}
            </FormationPlayerGroup>
          )}
          {unusedPlayers.length > 0 && (
            <FormationPlayerGroup title="미출전">
              {unusedPlayers.map((player) => renderPlayer(player, true))}
            </FormationPlayerGroup>
          )}
        </div>
      )}
    </FormationBoardFrame>
  );
};

export default FormationBoard;
