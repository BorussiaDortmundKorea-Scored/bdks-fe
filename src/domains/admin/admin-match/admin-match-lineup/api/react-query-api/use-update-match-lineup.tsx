import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type IUpdateMatchLineupRequest,
  updateMatchLineup,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useUpdateMatchLineup = (matchId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (lineup: IUpdateMatchLineupRequest) => {
      const response = await updateMatchLineup(lineup);
      return handleSupabaseApiResponse(response, lineup);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });
      toast({ content: "라인업 수정을 성공했어요" });
    },
    onError: () => {
      toast({ content: "라인업 수정에 실패했어요" });
    },
  });
};
