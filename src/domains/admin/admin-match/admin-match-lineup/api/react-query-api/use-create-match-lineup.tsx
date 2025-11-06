import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type ICreateMatchLineupRequest,
  createMatchLineup,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useCreateMatchLineup = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lineup: ICreateMatchLineupRequest) => {
      const response = await createMatchLineup(lineup);
      return handleSupabaseApiResponse(response, lineup);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });
    },
  });
};
