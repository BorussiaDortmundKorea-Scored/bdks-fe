import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { deleteCompetition } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useDeleteCompetition() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCompetition(id);
      return handleSupabaseApiResponse(response, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITIONS],
      });
      toast({ content: "대회 삭제를 성공했어요" });
    },
    onError: (error: Error) => {
      toast({ content: `대회 삭제 실패: ${error.message}` });
    },
  });
}
