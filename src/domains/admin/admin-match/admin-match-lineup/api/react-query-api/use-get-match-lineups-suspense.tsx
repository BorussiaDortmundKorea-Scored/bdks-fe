import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getMatchLineups } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useGetMatchLineupsSuspense = (matchId: string) => {
  return useSuspenseQuery({
    queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
    queryFn: async () => {
      const response = await getMatchLineups(matchId);

      return handleSupabaseApiResponse(response);
    },
  });
};
