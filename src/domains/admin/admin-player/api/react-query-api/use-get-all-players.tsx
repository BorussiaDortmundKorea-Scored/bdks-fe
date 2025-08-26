import { useQuery } from "@tanstack/react-query";

import { getAllPlayers } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

export function useGetAllPlayers() {
  return useQuery({
    queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
    queryFn: getAllPlayers,
  });
}
