import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllTeams } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

export function useGetAllTeamsSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS],
    queryFn: async () => {
      const response = await getAllTeams();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data || [];
    },
  });

  const { data } = query;

  return { data };
}
