// src/domains/matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/use-insert-match-player-rating.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type IInsertPlayerRatingRequest,
  type IInsertPlayerRatingResponse,
  insertPlayerRating,
} from "@matches/matches-lastest/matches-lastest-player-rating/api/matches-lastest-player-rating-api";
import { MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS } from "@matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/matches-lastest-player-rating-query-keys";

export const useInsertMatchPlayerRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: IInsertPlayerRatingRequest): Promise<IInsertPlayerRatingResponse> => {
      console.log("🚀 평점 입력 뮤테이션 시작:", request);

      const response = await insertPlayerRating(request);

      if (response.error) {
        console.error("❌ 평점 입력 실패:", response.error);
        throw new Error(response.error.message);
      }

      console.log("✅ 평점 입력 성공:", response.data);
      return response.data!;
    },
    onSuccess: (data, variables) => {
      console.log("🎉 뮤테이션 성공 콜백:", { data, variables });

      // 로컬 캐시도 무효화
      queryClient.invalidateQueries({
        queryKey: [MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS.MATCH_PLAYER_RATING],
      });
    },
    onError: (error) => {
      console.error("💥 뮤테이션 에러:", error);
    },
  });
};
