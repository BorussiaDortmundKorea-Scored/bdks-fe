import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCompetition } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

export function useDeleteCompetition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCompetition(id);
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
