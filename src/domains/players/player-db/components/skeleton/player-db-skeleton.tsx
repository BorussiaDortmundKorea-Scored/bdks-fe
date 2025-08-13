/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";
import PlayerDbWrapper from "../wrapper/player-db-wrapper";

interface IPlayerDbSkeleton {}

const PlayerDbSkeleton: React.FC<IPlayerDbSkeleton> = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <PlayerDbWrapper>
      <div data-testid="player-db-skeleton"></div>
    </PlayerDbWrapper>
  );
};

export default PlayerDbSkeleton;
