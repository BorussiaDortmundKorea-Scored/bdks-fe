import { useSuspenseQuery } from "@tanstack/react-query";

import { TIME_UNIT } from "@shared/constants/time-unit";
import {
  type IGetPlayerStatsRequest,
  type IPlayerStats,
  getPlayerStats,
} from "@players/players-stats/api/player-stats-api";
import { PLAYER_STATS_QUERY_KEYS } from "@players/players-stats/api/react-query-api/player-stats-query-key";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetPlayerStats(request: IGetPlayerStatsRequest) {
  const query = useSuspenseQuery<IPlayerStats>({
    queryKey: [PLAYER_STATS_QUERY_KEYS.PLAYER_STATS, request],
    queryFn: async () => {
      const response = await getPlayerStats(request);
      return handleSupabaseApiResponse(response);
    },
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  const { data } = query;

  return { data };
}

