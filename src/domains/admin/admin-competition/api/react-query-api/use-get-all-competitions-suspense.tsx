import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllCompetitions } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

export function useGetAllCompetitionsSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITIONS],
    queryFn: async () => {
      const response = await getAllCompetitions();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || [];
    },
  });

  const { data } = query;

  return { data };
}
