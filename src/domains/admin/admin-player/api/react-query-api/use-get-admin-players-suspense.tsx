import { useSuspenseQuery } from "@tanstack/react-query";

import { getAdminPlayers } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAdminPlayersSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS, "status"],
    queryFn: async () => {
      const response = await getAdminPlayers();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
