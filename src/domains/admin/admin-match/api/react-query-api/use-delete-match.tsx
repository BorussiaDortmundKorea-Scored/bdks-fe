import { ADMIN_MATCH_QUERY_KEYS } from "./admin-match-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMatch } from "@admin/admin-match/api/admin-match-api";

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error("경기 삭제 실패:", error);
    },
  });
};
