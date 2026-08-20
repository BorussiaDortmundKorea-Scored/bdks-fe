import { useSuspenseQuery } from "@tanstack/react-query";

import { getMatchParticipationCoverage } from "@admin/admin-dashboard/admin-dashboard-match-coverage/api/admin-dashboard-match-coverage-api";
import { ADMIN_DASHBOARD_MATCH_COVERAGE_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-match-coverage/api/react-query-api/admin-dashboard-match-coverage-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetMatchCoverageSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_MATCH_COVERAGE_QUERY_KEYS.MATCH_COVERAGE],
    queryFn: async () => {
      const response = await getMatchParticipationCoverage();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5, // 5분
  });

  const { data } = query;

  return { data };
}
