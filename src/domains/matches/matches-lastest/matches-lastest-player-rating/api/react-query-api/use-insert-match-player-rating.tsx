// src/domains/matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/use-insert-match-player-rating.tsx
// types에서 import
import type { IInsertPlayerRatingRequest, IInsertPlayerRatingResponse } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { insertPlayerRating } from "@matches/matches-lastest/matches-lastest-player-rating/api/matches-lastest-player-rating-api";
import { MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS } from "@matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/matches-lastest-player-rating-query-keys";

export const useInsertMatchPlayerRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: IInsertPlayerRatingRequest): Promise<IInsertPlayerRatingResponse> => {
      const response = await insertPlayerRating(request);

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS.MATCH_PLAYER_RATING],
      });
    },
  });
};
