import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type IAddMatchBenchPlayersRequest,
  addMatchBenchPlayers,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { getAddBenchPlayersErrorMessage } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-error";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useAddMatchBenchPlayers = (matchId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (payload: IAddMatchBenchPlayersRequest) => {
      const response = await addMatchBenchPlayers(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: (insertedCount) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId) });
      toast({ content: `후보 ${insertedCount}명을 추가했어요` });
    },
    onError: (error) => {
      toast({ content: getAddBenchPlayersErrorMessage(error) });
    },
  });
};
