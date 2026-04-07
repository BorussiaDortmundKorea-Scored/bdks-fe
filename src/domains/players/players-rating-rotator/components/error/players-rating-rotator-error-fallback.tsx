import PlayersRatingRotatorWrapper from "../wrapper/players-rating-rotator-wrapper";

import { API_ERROR_LOGO } from "@shared/constants/supabse-storage";

const PlayerRatingRotatorErrorFallback = () => {
  return (
    <PlayersRatingRotatorWrapper>
      <div className="flex w-full flex-col items-center justify-center gap-3 py-6 text-yds-c1m text-primary-100">
        <img src={API_ERROR_LOGO} alt="에러" className="h-16 w-16" />
        보루센 평점을 일시적으로 가져오지 못했습니다.
      </div>
    </PlayersRatingRotatorWrapper>
  );
};

export default PlayerRatingRotatorErrorFallback;
