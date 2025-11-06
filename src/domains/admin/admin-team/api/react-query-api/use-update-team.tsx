import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IUpdateTeamRequest, updateTeam } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useUpdateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (team: IUpdateTeamRequest) => {
      const response = await updateTeam(team);
      return handleSupabaseApiResponse(response, team);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS],
      });
    },
  });
}
