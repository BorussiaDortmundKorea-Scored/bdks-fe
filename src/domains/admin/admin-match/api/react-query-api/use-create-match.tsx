import { ADMIN_MATCH_QUERY_KEYS } from "./admin-match-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreateMatchRequest, createMatch } from "@admin/admin-match/api/admin-match-api";

export const useCreateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (match: ICreateMatchRequest) => createMatch(match),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
      });
    },
    onError: (error) => {
      console.error("경기 생성 실패:", error);
    },
  });
};
