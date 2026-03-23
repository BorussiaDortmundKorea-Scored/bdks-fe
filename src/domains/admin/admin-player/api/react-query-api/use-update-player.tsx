import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IPlayer, type IUpdatePlayerRequest, updatePlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useUpdatePlayer() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  const mutation = useMutation({
    mutationFn: async (player: IUpdatePlayerRequest): Promise<IPlayer> => {
      const response = await updatePlayer(player);
      return handleSupabaseApiResponse(response, player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
      });
      toast({ content: "선수 수정을 성공했어요" });
    },
    onError: () => {
      toast({ content: "선수 수정에 실패했어요" });
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
