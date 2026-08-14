import { useSuspenseQuery } from "@tanstack/react-query";

import { getTransfers } from "@admin/admin-transfer/api/admin-transfer-api";
import { ADMIN_TRANSFER_QUERY_KEYS } from "@admin/admin-transfer/api/react-query-api/admin-transfer-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

// 관리자 이적 목록 (전체, 최신순) - ReactQueryBoundary용 suspense
export function useGetAllTransfersSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_TRANSFER_QUERY_KEYS.TRANSFERS],
    queryFn: async () => {
      const response = await getTransfers();
      return handleSupabaseApiResponse(response);
    },
  });

  return { data: query.data };
}
