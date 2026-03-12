import { useSuspenseQuery } from "@tanstack/react-query";

import { getViewingMatches } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/viewing-check-api";
import { VIEWING_CHECK_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/react-query-api/viewing-check-query-keys";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetViewingMatches() {
  const query = useSuspenseQuery({
    queryKey: [VIEWING_CHECK_QUERY_KEYS.VIEWING_MATCHES],
    queryFn: async () => {
      const response = await getViewingMatches();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
