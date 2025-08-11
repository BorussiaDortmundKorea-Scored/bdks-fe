import { useSuspenseQuery } from "@tanstack/react-query";
import {
  getRotatePlayerStatAccumulated,
  type IRotatePlayerStatAccumulated,
} from "@players/players-rating-rotator/api/player-rating-rotator-api";

export function useGetRotatePlayerStatAcc(): IRotatePlayerStatAccumulated[] {
  const { data } = useSuspenseQuery<IRotatePlayerStatAccumulated[]>({
    queryKey: ["rotate-player-stat-acc"],
    queryFn: getRotatePlayerStatAccumulated,
  });

  return data;
}
