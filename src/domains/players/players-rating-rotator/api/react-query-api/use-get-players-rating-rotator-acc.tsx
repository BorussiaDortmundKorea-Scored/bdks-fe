import { useSuspenseQuery } from "@tanstack/react-query";

import {
  type IRotatePlayerStatAccumulated,
  getPlayersRatingRotatorAcc,
} from "@players/players-rating-rotator/api/players-rating-rotator-api";
import { PLAYER_RATING_ROTATOR_QUERY_KEYS } from "@players/players-rating-rotator/api/react-query-api/players-rating-rotator-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetPlayersRatingRotatorAcc(): IRotatePlayerStatAccumulated[] {
  const { data } = useSuspenseQuery<IRotatePlayerStatAccumulated[]>({
    queryKey: [PLAYER_RATING_ROTATOR_QUERY_KEYS.PLAYER_RATING_ROTATOR_ACC],
    queryFn: async () => {
      const response = await getPlayersRatingRotatorAcc();
      return handleSupabaseApiResponse(response);
    },
  });

  return data;
}
