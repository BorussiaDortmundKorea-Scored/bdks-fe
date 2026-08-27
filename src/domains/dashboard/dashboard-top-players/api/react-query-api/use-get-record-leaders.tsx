/**
 * 작성자: KYD
 * 기능: 대시보드 선수 기록 리더 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getDashboardRecordLeaders } from "@dashboard/dashboard-top-players/api/dashboard-top-players-api";
import { DASHBOARD_TOP_PLAYERS_QUERY_KEYS } from "@dashboard/dashboard-top-players/api/react-query-api/dashboard-top-players-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetRecordLeadersSuspense() {
  const { data } = useSuspenseQuery({
    queryKey: [DASHBOARD_TOP_PLAYERS_QUERY_KEYS.RECORD_LEADERS],
    queryFn: async () => {
      const response = await getDashboardRecordLeaders();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5,
  });

  return data;
}
