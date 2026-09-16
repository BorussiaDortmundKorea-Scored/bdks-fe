/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getUserRetentionFunnel } from "@admin/admin-dashboard/admin-dashboard-retention/api/admin-dashboard-retention-api";
import { ADMIN_DASHBOARD_RETENTION_QUERY_KEYS } from "@admin/admin-dashboard/admin-dashboard-retention/api/react-query-api/admin-dashboard-retention-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetRetentionFunnel() {
  const { data } = useSuspenseQuery({
    queryKey: [ADMIN_DASHBOARD_RETENTION_QUERY_KEYS.RETENTION_FUNNEL],
    queryFn: async () => {
      const response = await getUserRetentionFunnel();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5,
  });

  return data;
}
