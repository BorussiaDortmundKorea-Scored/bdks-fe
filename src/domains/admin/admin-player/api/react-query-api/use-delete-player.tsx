import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const response = await deletePlayer(id);
      // Supabase RPC/쿼리는 HTTP 200이어도 body.error가 채워질 수 있음
      // (예: FK 제약 409 Conflict 등). error가 존재하면 throw하여 onError로 위임.
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
      console.error("Failed to delete player:", error);
      alert(`선수 삭제 실패: ${error.message}`);
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
