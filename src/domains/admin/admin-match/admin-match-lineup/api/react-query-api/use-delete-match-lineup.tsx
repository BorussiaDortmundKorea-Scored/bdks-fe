import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

export const useDeleteMatchLineup = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMatchLineup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });
    },
    onError: (error) => {
      console.error("라인업 삭제 실패:", error);
    },
  });
};
