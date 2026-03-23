import { ADMIN_MATCH_QUERY_KEYS } from "./admin-match-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { deleteMatch } from "@admin/admin-match/api/admin-match-api";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteMatch(id);
      return handleSupabaseApiResponse(response, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_QUERY_KEYS.lists(),
      });
      toast({ content: "경기 삭제를 성공했어요" });
    },
    onError: () => {
      toast({ content: "경기 삭제에 실패했어요" });
    },
  });
};
