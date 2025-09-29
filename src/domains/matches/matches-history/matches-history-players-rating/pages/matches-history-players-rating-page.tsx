/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import MatchesHistoryPlayersRatingErrorFallback from "../components/error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRating from "../components/matches-history-players-rating";
import MatchesHistoryPlayersRatingSkeleton from "../components/skeleton/matches-history-players-rating-skeleton";

import BackButton from "@shared/components/layout/header/buttons/back-button";
import Header from "@shared/components/layout/header/header";
import LayoutWithHeader from "@shared/provider/layout-with-header";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const MatchesHistoryPlayersRatingPage = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  const options = {
    leftIcon: <BackButton />,
  };
  //!SECTION 메서드 영역

  return (
    <div className="bdks-container">
      <Header options={options} />
      <LayoutWithHeader>
        <ReactQueryBoundary
          skeleton={<MatchesHistoryPlayersRatingSkeleton />}
          errorFallback={MatchesHistoryPlayersRatingErrorFallback}
        >
          <MatchesHistoryPlayersRating />
        </ReactQueryBoundary>
      </LayoutWithHeader>
    </div>
  );
};

export default MatchesHistoryPlayersRatingPage;
