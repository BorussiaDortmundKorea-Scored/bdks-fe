import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useDeletePlayer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const response = await deletePlayer(id);
      return handleSupabaseApiResponse(response, id);
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
