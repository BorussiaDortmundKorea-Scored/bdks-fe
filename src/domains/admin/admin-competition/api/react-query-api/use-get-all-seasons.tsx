import { useQuery } from "@tanstack/react-query";

import { getAllSeasons } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAllSeasons() {
  return useQuery({
    queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_SEASONS],
    queryFn: async () => {
      const response = await getAllSeasons();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 30, // 시즌은 거의 안 바뀌므로 30분 캐시
  });
}
