import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type IUpdateMatchLineupRequest,
  updateMatchLineup,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

export const useUpdateMatchLineup = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lineup: IUpdateMatchLineupRequest) => updateMatchLineup(lineup),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });
    },
    onError: (error) => {
      console.error("라인업 수정 실패:", error);
    },
  });
};
