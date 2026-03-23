import { ADMIN_MATCH_QUERY_KEYS } from "./admin-match-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type IUpdateMatchRequest, updateMatch } from "@admin/admin-match/api/admin-match-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (match: IUpdateMatchRequest) => {
      const response = await updateMatch(match);
      return handleSupabaseApiResponse(response, match);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
      });
      toast({ content: "경기 수정을 성공했어요" });
    },
    onError: () => {
      toast({ content: "경기 수정에 실패했어요" });
    },
  });
};
