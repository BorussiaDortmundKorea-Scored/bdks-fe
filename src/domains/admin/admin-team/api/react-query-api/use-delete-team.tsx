import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { deleteTeam } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTeam(id);
      return handleSupabaseApiResponse(response, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS],
      });
      toast({ content: "팀 삭제를 성공했어요" });
    },
    onError: () => {
      toast({ content: "팀 삭제에 실패했어요" });
    },
  });
}
