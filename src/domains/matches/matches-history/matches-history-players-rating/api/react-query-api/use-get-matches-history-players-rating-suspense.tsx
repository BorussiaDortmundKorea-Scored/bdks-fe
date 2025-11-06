import { useSuspenseQueries } from "@tanstack/react-query";

import {
  getMatchInfo,
  getMatchesHistoryPlayersRating,
} from "@matches/matches-history/matches-history-players-rating/api/matches-history-players-rating-api";
import { MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS } from "@matches/matches-history/matches-history-players-rating/api/react-query-api/matches-history-players-rating-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetMatchesHistoryPlayersRatingSuspense(matchId: string) {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: [MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS.MATCHES_HISTORY_PLAYERS_RATING, matchId],
        queryFn: async () => {
          const response = await getMatchesHistoryPlayersRating(matchId);
          return handleSupabaseApiResponse(response);
        },
      },
      {
        queryKey: [MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS.MATCHES_HISTORY_PLAYERS_RATING, matchId, "info"],
        queryFn: async () => {
          const response = await getMatchInfo(matchId);
          return handleSupabaseApiResponse(response);
        },
      },
    ],
  });

  const [playersRatingQuery, matchInfoQuery] = results;

  return { data: playersRatingQuery.data, matchInfo: matchInfoQuery.data } as const;
}
