/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위 조회 React Query 훅
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getPopularFavoritePlayers } from "@admin/admin-user/admin-user-popular-players/api/admin-user-popular-players-api";
import { adminUserPopularPlayersQueryKeys } from "@admin/admin-user/admin-user-popular-players/api/react-query-api/admin-user-popular-players-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useGetPopularFavoritePlayersSuspense = () => {
  return useSuspenseQuery({
    queryKey: adminUserPopularPlayersQueryKeys.players(),
    queryFn: async () => {
      const response = await getPopularFavoritePlayers();
      return handleSupabaseApiResponse(response);
    },
    staleTime: 1000 * 60 * 5,
  });
};
