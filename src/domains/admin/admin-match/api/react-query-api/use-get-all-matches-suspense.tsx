import { ADMIN_MATCH_QUERY_KEYS } from "./admin-match-query-key";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllMatches } from "@admin/admin-match/api/admin-match-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useGetAllMatchesSuspense = () => {
  return useSuspenseQuery({
    queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
    queryFn: async () => {
      const response = await getAllMatches();
      return handleSupabaseApiResponse(response);
    },
  });
};
