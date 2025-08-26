import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreateTeamRequest, createTeam } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

export function useCreateTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (team: ICreateTeamRequest) => {
      const response = await createTeam(team);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS],
      });
    },
  });
}
