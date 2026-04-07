import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserViewingRanking } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/user-ranking-api";
import { USER_RANKING_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/react-query-api/user-ranking-query-keys";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetUserViewingRanking() {
  const query = useSuspenseQuery({
    queryKey: [USER_RANKING_QUERY_KEYS.USER_VIEWING_RANKING],
    queryFn: async () => {
      const response = await getUserViewingRanking();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
