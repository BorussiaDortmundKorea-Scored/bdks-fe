import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreatePlayerRequest, type IPlayer, createPlayer } from "@admin/admin-player/api/admin-player-api";
import { ADMIN_PLAYER_QUERY_KEYS } from "@admin/admin-player/api/react-query-api/admin-player-query-keys";

export function useCreatePlayer() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (player: ICreatePlayerRequest): Promise<IPlayer> => {
      const response = await createPlayer(player);
      // Supabase 응답은 성공 HTTP 상태에서도 error 필드가 채워질 수 있음
      // (권한/제약 조건 위반 등). error가 있으면 throw하여 React Query onError로 전달.
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
      console.error("Failed to create player:", error);
      alert(`선수 생성 실패: ${error.message}`);
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
