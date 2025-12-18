import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type ISubstituteMatchLineupRequest,
  substituteMatchLineup,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useSubstituteMatchLineup = (matchId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ISubstituteMatchLineupRequest) => {
      const response = await substituteMatchLineup(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });
    },
  });
};
