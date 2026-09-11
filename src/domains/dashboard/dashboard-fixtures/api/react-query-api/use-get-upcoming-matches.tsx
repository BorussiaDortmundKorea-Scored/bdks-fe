/**
 * 작성자: KYD
 * 기능: 다가오는 경기 일정 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { type IUpcomingMatch, getUpcomingMatches } from "@dashboard/dashboard-fixtures/api/dashboard-fixtures-api";
import { DASHBOARD_FIXTURES_QUERY_KEYS } from "@dashboard/dashboard-fixtures/api/react-query-api/dashboard-fixtures-query-keys";

import { TIME_UNIT } from "@shared/constants/time-unit";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetUpcomingMatches() {
  const { data } = useSuspenseQuery<IUpcomingMatch[]>({
    queryKey: [DASHBOARD_FIXTURES_QUERY_KEYS.UPCOMING_MATCHES],
    queryFn: async () => {
      const response = await getUpcomingMatches();
      return handleSupabaseApiResponse(response);
    },
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  return data;
}
