import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllPlayers } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

export function useGetAllPlayersSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
    queryFn: async () => {
      const response = await getAllPlayers();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || [];
    },
  });

  const { data } = query;

  return { data };
}
