import MatchesHistoryPlayersRatingWrapper from "../wrapper/matches-history-players-rating-wrapper";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const MatchesHistoryPlayersRatingErrorFallback = () => {
  return (
    <MatchesHistoryPlayersRatingWrapper>
      <div
        data-testid="matches-history-players-rating-error-fallback"
        className="flex w-full flex-col items-center justify-center gap-3 py-6 text-yds-c1m text-primary-100"
      >
        <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
        평점 정보를 불러오지 못했습니다.
      </div>
    </MatchesHistoryPlayersRatingWrapper>
  );
};

export default MatchesHistoryPlayersRatingErrorFallback;
