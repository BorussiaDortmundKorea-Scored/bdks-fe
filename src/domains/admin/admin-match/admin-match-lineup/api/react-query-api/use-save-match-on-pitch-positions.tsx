import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type ISaveMatchOnPitchPositionsRequest,
  saveMatchOnPitchPositions,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { getSaveOnPitchPositionsErrorMessage } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-error";
import { ADMIN_MATCH_QUERY_KEYS } from "@admin/admin-match/api/react-query-api/admin-match-query-key";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

interface IUseSaveMatchOnPitchPositionsOptions {
  /** 다른 저장과 이어서 부를 때 토스트를 한 번만 띄우려고 끈다 */
  silent?: boolean;
}

export const useSaveMatchOnPitchPositions = (
  matchId: string,
  { silent = false }: IUseSaveMatchOnPitchPositionsOptions = {},
) => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (payload: ISaveMatchOnPitchPositionsRequest) => {
      const response = await saveMatchOnPitchPositions(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId) });
      // 경기 목록의 formation 도 함께 바뀐다
      queryClient.invalidateQueries({ queryKey: ADMIN_MATCH_QUERY_KEYS.lists() });
      if (!silent) toast({ content: "자리를 반영했어요" });
    },
    onError: (error) => {
      toast({ content: getSaveOnPitchPositionsErrorMessage(error) });
    },
  });
};
