import { useSuspenseQuery } from "@tanstack/react-query";

import { type IPlayerDBWithMyRatings, getPlayersDbWithMyRatings } from "@players/players-db/api/players-db-api";
import { PLAYERS_DB_QUERY_KEYS } from "@players/players-db/api/react-query-api/players-db-query-key";

import { TIME_UNIT } from "@shared/constants/time-unit";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetPlayersDbWithMyRatings(userId: string) {
  const { data } = useSuspenseQuery<IPlayerDBWithMyRatings[]>({
    queryKey: [PLAYERS_DB_QUERY_KEYS.PLAYERS_DB_WITH_MY_RATINGS, userId],
    queryFn: async () => {
      const response = await getPlayersDbWithMyRatings(userId);
      return handleSupabaseApiResponse(response);
    },
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  return data;
}
