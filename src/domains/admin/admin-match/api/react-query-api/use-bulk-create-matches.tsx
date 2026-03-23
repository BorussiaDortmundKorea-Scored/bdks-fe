import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type IBulkCreateMatchesRequest,
  bulkCreateMatches,
} from "@admin/admin-match/api/admin-match-api";
import { ADMIN_MATCH_QUERY_KEYS } from "@admin/admin-match/api/react-query-api/admin-match-query-key";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useBulkCreateMatches = () => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (payload: IBulkCreateMatchesRequest) => {
      const response = await bulkCreateMatches(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
      });
      toast({ content: "경기 일괄 생성을 성공했어요" });
    },
    onError: () => {
      toast({ content: "경기 일괄 생성에 실패했어요" });
    },
  });
};

