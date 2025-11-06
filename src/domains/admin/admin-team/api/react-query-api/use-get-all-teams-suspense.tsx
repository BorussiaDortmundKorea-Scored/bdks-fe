import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllTeams } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAllTeamsSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS],
    queryFn: async () => {
      const response = await getAllTeams();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
