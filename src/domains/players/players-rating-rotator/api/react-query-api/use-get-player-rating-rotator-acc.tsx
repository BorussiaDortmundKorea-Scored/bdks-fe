import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getPlayerRatingRotatorAcc,
  type IRotatePlayerStatAccumulated,
} from "@players/players-rating-rotator/api/player-rating-rotator-api";

export function useGetPlayerRatingRotatorAcc(): IRotatePlayerStatAccumulated[] {
  const { data } = useSuspenseQuery<IRotatePlayerStatAccumulated[]>({
    queryKey: ["player-rating-rotator-acc"],
    queryFn: getPlayerRatingRotatorAcc,
  });

  return data;
}
