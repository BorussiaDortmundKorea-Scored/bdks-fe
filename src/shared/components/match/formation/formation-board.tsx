/**
 * 작성자: KYD
 * 기능: 포메이션 본문 (최신경기 · 경기 평점 공용)
 * 프로세스 설명: 옐로우 월 위 반투명 레이어 안에 경기정보 + 포메이션을 그리고, 우하단 토글로
 *              선발/교체 명단을 전환한다. 두 화면의 본문이 같은 코드였어서 여기로 옮겼다.
 *
 * 1. 포메이션 렌더링 선발명단: 축구 1선,2선,3선,4선,5선 순으로 float left 방식으로 구현
 * 2. 포메이션 렌더링 후보명단: 5선 밑에 후보명단 렌더링
 */
import { type ReactNode, useState } from "react";

import FormationPlayerCard from "@shared/components/match/formation/formation-player-card";
import FormationShell from "@shared/components/match/formation/formation-shell";
import { type FormationLines, type IFormationPlayer } from "@shared/components/match/formation/formation-types";

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
  const [viewType, setViewType] = useState<"PLAY" | "NOT_PLAY">("PLAY");
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
    <FormationShell>
      {/* 상단부 : 경기정보 */}
      <div className="bg-background-secondary-layer flex h-full w-full flex-col rounded-[4px] p-2">
        <div className="flex h-auto w-full items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="text-yds-b1 text-white">{title}</div>
            <div className="text-primary-100 text-yds-c1m">{subtitle}</div>
          </div>
          {headerRight}
        </div>

        {/* 조건별 하단부 : 포메이션 선발 명단 렌더링 */}
        {viewType === "PLAY" && (
          <div className="flex h-auto w-full flex-1 flex-col justify-between py-4">
            {Object.values(playingMembers).map((line, index) => (
              <div key={index} className="flex h-auto w-full flex-nowrap items-center justify-around">
                {line.map((player) => renderPlayer(player))}
              </div>
            ))}
          </div>
        )}

        {/* 조건별 하단부 : 포메이션 교체 명단 렌더링 */}
        {viewType === "NOT_PLAY" && (
          <div className="flex h-auto w-full flex-1 flex-col gap-4 overflow-y-auto py-4">
            {substitutedOutPlayers.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-yds-b2 text-white">교체 아웃</span>
                <div className="flex flex-wrap gap-3">
                  {substitutedOutPlayers.map((player) => renderPlayer(player))}
                </div>
              </div>
            )}
            {unusedPlayers.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-yds-b2 text-white">미출전</span>
                <div className="flex flex-wrap gap-3">{unusedPlayers.map((player) => renderPlayer(player, true))}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 포메이션 뷰 타입 토글 버튼 */}
      <div className="bg-background-secondary-layer absolute right-4 bottom-4 z-10 flex overflow-hidden rounded-full shadow-lg backdrop-blur-sm">
        <button
          className={`text-yds-c1m px-3 py-1.5 transition-colors ${viewType === "PLAY" ? "text-primary-400" : "text-white"}`}
          onClick={() => setViewType("PLAY")}
        >
          선발
        </button>
        <button
          className={`text-yds-c1m px-3 py-1.5 transition-colors ${viewType === "NOT_PLAY" ? "text-primary-400" : "text-white"}`}
          onClick={() => setViewType("NOT_PLAY")}
        >
          교체
        </button>
      </div>
    </FormationShell>
  );
};

export default FormationBoard;
