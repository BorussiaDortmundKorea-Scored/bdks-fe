/**
 * 작성자: KYD
 * 기능: 최근 경기 선수 평가 페이지 (경기중 + 다음경기 시작전까지 평점 입력 가능)
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import MatchesLastestPlayerRatingErrorFallback from "@matches/matches-lastest/matches-lastest-player-rating/components/error/matches-lastest-player-rating-error-fallback";
import MatchesLastestPlayerRating from "@matches/matches-lastest/matches-lastest-player-rating/components/matches-lastest-player-rating";
import MatchesLastestPlayerRatingSkeleton from "@matches/matches-lastest/matches-lastest-player-rating/components/skeleton/matches-lastest-player-rating-skeleton";

import BackButton from "@shared/components/layout/header/buttons/back-button";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const options = {
  leftIcon: <BackButton />,
};
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const MatchesLastestPlayerRatingPage = () => {
  //SECTION HOOK호출 영역
  const { pageRef } = usePageTransition();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <ReactQueryBoundary
        skeleton={<MatchesLastestPlayerRatingSkeleton />}
        errorFallback={MatchesLastestPlayerRatingErrorFallback}
      >
        <MatchesLastestPlayerRating />
      </ReactQueryBoundary>
    </div>
  );
};

export default MatchesLastestPlayerRatingPage;
