/**
 * 작성자: KYD
 * 기능: 리그 순위 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getStandings } from "@admin/admin-competition/admin-standings/api/admin-standings-api";
import { ADMIN_STANDINGS_QUERY_KEYS } from "@admin/admin-competition/admin-standings/api/react-query-api/admin-standings-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetStandingsSuspense(competition: string) {
  const { data } = useSuspenseQuery({
    queryKey: [ADMIN_STANDINGS_QUERY_KEYS.STANDINGS, competition],
    queryFn: async () => {
      const response = await getStandings(competition);
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5,
  });

  return data;
}
