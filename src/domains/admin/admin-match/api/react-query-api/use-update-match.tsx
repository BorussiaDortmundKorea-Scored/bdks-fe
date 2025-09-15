import { ADMIN_MATCH_QUERY_KEYS } from "./admin-match-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IUpdateMatchRequest, updateMatch } from "@admin/admin-match/api/admin-match-api";

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (match: IUpdateMatchRequest) => updateMatch(match),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error("경기 수정 실패:", error);
    },
  });
};
