import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { deletePlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useDeletePlayer() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  const mutation = useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const response = await deletePlayer(id);
      return handleSupabaseApiResponse(response, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
      });
      toast({ content: "선수 삭제를 성공했어요" });
    },
    onError: (error: Error) => {
      toast({ content: `선수 삭제 실패: ${error.message}` });
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
