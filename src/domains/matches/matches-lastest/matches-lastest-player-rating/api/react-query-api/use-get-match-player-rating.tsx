// types에서 import
import type { IGetMatchPlayerRatingRequest } from "../../types";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getMatchPlayerRating } from "@matches/matches-lastest/matches-lastest-player-rating/api/matches-lastest-player-rating-api";
import { MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS } from "@matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/matches-lastest-player-rating-query-keys";

interface UseGetMatchPlayerRatingProps {
  matchId: string;
  playerId: string;
}

export function useGetMatchPlayerRating({ matchId, playerId }: UseGetMatchPlayerRatingProps) {
  const query = useSuspenseQuery({
    queryKey: [MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS.MATCH_PLAYER_RATING, matchId, playerId],
    queryFn: async () => {
      const request: IGetMatchPlayerRatingRequest = {
        match_id: matchId,
        player_id: playerId,
      };

      const response = await getMatchPlayerRating(request);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data; // JSON 객체 반환
    },
  });

  const { data } = query;

  return { data };
}
