import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type ISaveMatchStartingLineupRequest,
  saveMatchStartingLineup,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { getSaveStartingLineupErrorMessage } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-error";
import { ADMIN_MATCH_QUERY_KEYS } from "@admin/admin-match/api/react-query-api/admin-match-query-key";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useSaveMatchStartingLineup = (matchId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (payload: ISaveMatchStartingLineupRequest) => {
      const response = await saveMatchStartingLineup(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId) });
      // 경기 목록의 formation 도 함께 바뀐다
      queryClient.invalidateQueries({ queryKey: ADMIN_MATCH_QUERY_KEYS.lists() });
      toast({ content: "라인업에 반영했어요" });
    },
    onError: (error) => {
      toast({ content: getSaveStartingLineupErrorMessage(error) });
    },
  });
};
