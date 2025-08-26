import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IUpdateCompetitionRequest, updateCompetition } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

export function useUpdateCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (competition: IUpdateCompetitionRequest) => {
      const response = await updateCompetition(competition);
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITIONS],
      });
    },
  });
}
