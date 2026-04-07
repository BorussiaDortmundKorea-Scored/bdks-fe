import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserRatingRanking } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/user-ranking-api";
import { USER_RANKING_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/user-ranking/api/react-query-api/user-ranking-query-keys";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetUserRanking() {
  const query = useSuspenseQuery({
    queryKey: [USER_RANKING_QUERY_KEYS.USER_RATING_RANKING],
    queryFn: async () => {
      const response = await getUserRatingRanking();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
