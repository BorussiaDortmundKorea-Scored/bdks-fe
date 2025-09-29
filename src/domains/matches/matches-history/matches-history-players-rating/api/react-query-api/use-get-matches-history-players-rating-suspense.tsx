import { useSuspenseQuery } from "@tanstack/react-query";

import { getMatchesHistoryPlayersRating } from "@matches/matches-history/matches-history-players-rating/api/matches-history-players-rating-api";
import { MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS } from "@matches/matches-history/matches-history-players-rating/api/react-query-api/matches-history-players-rating-query-keys";

export function useGetMatchesHistoryPlayersRatingSuspense(matchId: string) {
  const query = useSuspenseQuery({
    queryKey: [MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS.MATCHES_HISTORY_PLAYERS_RATING, matchId],
    queryFn: async () => {
      const response = await getMatchesHistoryPlayersRating(matchId);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || [];
    },
  });

  const { data } = query;

  return { data };
}
