import { useSuspenseQuery } from "@tanstack/react-query";

import { TIME_UNIT } from "@shared/constants/time-unit";
import {
  type IGetPlayerRatingByMatchDetailRequest,
  type IPlayerRatingByMatchDetailResponse,
  getPlayerRatingByMatchDetail,
} from "@players/players-stats/players-stats-by-game/api/player-rating-by-match-detail-api";
import { PLAYER_RATING_BY_MATCH_DETAIL_QUERY_KEYS } from "@players/players-stats/players-stats-by-game/api/react-query-api/player-rating-by-match-detail-query-key";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetPlayerRatingByMatchDetail(request: IGetPlayerRatingByMatchDetailRequest) {
  const query = useSuspenseQuery<IPlayerRatingByMatchDetailResponse>({
    queryKey: [PLAYER_RATING_BY_MATCH_DETAIL_QUERY_KEYS.PLAYER_RATING_BY_MATCH_DETAIL, request],
    queryFn: async () => {
      const response = await getPlayerRatingByMatchDetail(request);
      return handleSupabaseApiResponse(response);
    },
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  const { data } = query;

  return { data };
}
