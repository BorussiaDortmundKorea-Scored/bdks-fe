import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreatePlayerRequest, createPlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (player: ICreatePlayerRequest) => createPlayer(player),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
      });
    },
  });
}
