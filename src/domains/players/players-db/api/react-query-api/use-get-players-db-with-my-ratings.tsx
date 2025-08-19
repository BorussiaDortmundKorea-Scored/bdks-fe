import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlayersDbWithMyRatings, type IPlayerDBWithMyRatings } from "../players-db-api";
import { PLAYERS_DB_QUERY_KEYS } from "./players-db-query-key";
import { TIME_UNIT } from "@shared/constants/time-unit";

export function useGetPlayersDbWithMyRatings(userId: string) {
  const { data } = useSuspenseQuery<IPlayerDBWithMyRatings[]>({
    queryKey: [PLAYERS_DB_QUERY_KEYS.PLAYERS_DB_WITH_MY_RATINGS, userId],
    queryFn: () => getPlayersDbWithMyRatings(userId),
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  return data;
}
