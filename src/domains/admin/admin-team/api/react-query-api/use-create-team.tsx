import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type ICreateTeamRequest, createTeam } from "@admin/admin-team/api/admin-team-api";
import { ADMIN_TEAM_QUERY_KEYS } from "@admin/admin-team/api/react-query-api/admin-team-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useCreateTeam() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (team: ICreateTeamRequest) => {
      const response = await createTeam(team);
      return handleSupabaseApiResponse(response, team);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_TEAM_QUERY_KEYS.ALL_TEAMS],
      });
      toast({ content: "팀 생성을 성공했어요" });
    },
    onError: () => {
      toast({ content: "팀 생성에 실패했어요" });
    },
  });
}
