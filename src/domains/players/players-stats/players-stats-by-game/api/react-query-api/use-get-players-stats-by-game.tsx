import { useSuspenseQuery } from "@tanstack/react-query";

import { TIME_UNIT } from "@shared/constants/time-unit";
import {
  type IGetPlayerStatsByGameRequest,
  type IPlayerStatsByGame,
  getPlayerStatsByGame,
} from "@players/players-stats/players-stats-by-game/api/players-stats-by-game-api";
import { PLAYERS_STATS_BY_GAME_QUERY_KEYS } from "@players/players-stats/players-stats-by-game/api/react-query-api/players-stats-by-game-query-key";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetPlayersStatsByGame(request: IGetPlayerStatsByGameRequest) {
  const query = useSuspenseQuery<IPlayerStatsByGame[]>({
    queryKey: [PLAYERS_STATS_BY_GAME_QUERY_KEYS.PLAYERS_STATS_BY_GAME, request],
    queryFn: async () => {
      const response = await getPlayerStatsByGame(request);
      return handleSupabaseApiResponse(response);
    },
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  const { data } = query;

  return { data };
}

