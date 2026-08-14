import { useSuspenseQuery } from "@tanstack/react-query";

import { getTransfers } from "@auth/auth-info/auth-info-quick-links/transfer-market/api/transfer-market-api";
import { TRANSFER_MARKET_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/transfer-market/api/react-query-api/transfer-market-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetTransfers() {
  const query = useSuspenseQuery({
    queryKey: [TRANSFER_MARKET_QUERY_KEYS.TRANSFERS],
    queryFn: async () => {
      const response = await getTransfers();
      return handleSupabaseApiResponse(response);
    },
  });

  return { data: query.data };
}
