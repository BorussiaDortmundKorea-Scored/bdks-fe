import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreateCompetitionRequest, createCompetition } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

export function useCreateCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (competition: ICreateCompetitionRequest) => {
      const response = await createCompetition(competition);
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
