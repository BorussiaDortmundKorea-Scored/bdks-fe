import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTeam } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

export function useDeleteTeam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTeam(id);
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
