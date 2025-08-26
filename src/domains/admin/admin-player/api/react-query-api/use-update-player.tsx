import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IPlayer, type IUpdatePlayerRequest, updatePlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

export function useUpdatePlayer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (player: IUpdatePlayerRequest): Promise<IPlayer> => {
      const response = await updatePlayer(player);
      // Supabase는 RPC 실행 실패 시에도 200을 반환할 수 있으므로
      // response.error 존재 여부로 에러를 판단하고 throw하여 onError로 처리.
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_PLAYER_QUERY_KEYS.ALL_PLAYERS],
      });
    },
    onError: (error: Error) => {
      console.error("Failed to update player:", error);
      alert(`선수 수정 실패: ${error.message}`);
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
