/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import PlayerRatingRotatorWrapper from "../wrapper/players-rating-rotator-wrapper";

const PlayerRatingRotatorSkeleton = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <PlayerRatingRotatorWrapper>
      <div data-testid="players-rating-rotator-skeleton" className="flex w-full items-center justify-center">
        보루센 평점 가져오는중...
      </div>
    </PlayerRatingRotatorWrapper>
  );
};

export default PlayerRatingRotatorSkeleton;
