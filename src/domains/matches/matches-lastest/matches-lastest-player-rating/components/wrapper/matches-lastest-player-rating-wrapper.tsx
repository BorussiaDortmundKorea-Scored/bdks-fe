/**
 * 작성자: KYD
 * 기능: matches-lastest-player-rating 컴포넌트를 React Query Boundary로 감싸는 wrapper
 * 프로세스 설명: 에러 처리와 로딩 상태를 관리
 */
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import MatchesLastestPlayerRatingErrorFallback from "@matches/matches-lastest/matches-lastest-player-rating/components/error/matches-lastest-player-rating-error-fallback";
import MatchesLastestPlayerRating from "@matches/matches-lastest/matches-lastest-player-rating/components/matches-lastest-player-rating";
import MatchesLastestPlayerRatingSkeleton from "@matches/matches-lastest/matches-lastest-player-rating/components/skeleton/matches-lastest-player-rating-skeleton";

const MatchesLastestPlayerRatingWrapper = () => {
  return (
    <ReactQueryBoundary
      skeleton={<MatchesLastestPlayerRatingSkeleton />}
      errorFallback={MatchesLastestPlayerRatingErrorFallback}
    >
      <MatchesLastestPlayerRating />
    </ReactQueryBoundary>
  );
};

export default MatchesLastestPlayerRatingWrapper;
