import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type ICreateCompetitionRequest, createCompetition } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useCreateCompetition() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (competition: ICreateCompetitionRequest) => {
      const response = await createCompetition(competition);
      return handleSupabaseApiResponse(response, competition);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITIONS],
      });
      toast({ content: "대회 생성을 성공했어요" });
    },
    onError: () => {
      toast({ content: "대회 생성에 실패했어요" });
    },
  });
}
