import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllPlayers } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

export const useGetAllPlayersSuspense = () => {
  return useSuspenseQuery({
    queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.players(),
    queryFn: async () => {
      const response = await getAllPlayers();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || [];
    },
  });
};
