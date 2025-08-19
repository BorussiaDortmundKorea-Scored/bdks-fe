/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import PlayerDbWrapper from "@players/players-db/components/wrapper/players-db-wrapper";

const PlayersDbErrorFallback = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <PlayerDbWrapper>
      <div data-testid="player-db-error-fallback">에러발생</div>
    </PlayerDbWrapper>
  );
};

export default PlayersDbErrorFallback;
