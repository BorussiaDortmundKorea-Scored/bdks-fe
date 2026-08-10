import { useQuery } from "@tanstack/react-query";

import { getAllCompetitionTypes } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAllCompetitionTypes() {
  return useQuery({
    queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITION_TYPES],
    queryFn: async () => {
      const response = await getAllCompetitionTypes();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 30, // 대회 종류는 거의 안 바뀌므로 30분 캐시
  });
}
