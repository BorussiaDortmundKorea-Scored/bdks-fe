import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllPlayers } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAllPlayersSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
    queryFn: async () => {
      const response = await getAllPlayers();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
