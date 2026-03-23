import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type IBulkCreateMatchLineupsRequest,
  bulkCreateMatchLineups,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useBulkCreateMatchLineups = (matchId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (payload: IBulkCreateMatchLineupsRequest) => {
      const response = await bulkCreateMatchLineups(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });
      toast({ content: "스타팅 명단등록을 성공했어요" });
    },
    onError: () => {
      toast({ content: "스타팅 명단등록에 실패했어요" });
    },
  });
};
