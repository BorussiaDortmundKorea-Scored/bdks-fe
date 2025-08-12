import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlayerRatingRotatorAcc, type IRotatePlayerStatAccumulated } from "../player-rating-rotator-api";
import { PLAYER_RATING_ROTATOR_QUERY_KEYS } from "./players-rating-rotator-query-keys";

export function useGetPlayerRatingRotatorAcc(): IRotatePlayerStatAccumulated[] {
  const { data } = useSuspenseQuery<IRotatePlayerStatAccumulated[]>({
    queryKey: [PLAYER_RATING_ROTATOR_QUERY_KEYS.PLAYER_RATING_ROTATOR_ACC],
    queryFn: getPlayerRatingRotatorAcc,
  });

  return data;
}
