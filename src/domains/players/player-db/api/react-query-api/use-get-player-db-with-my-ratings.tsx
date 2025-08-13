import { useSuspenseQuery } from "@tanstack/react-query";
import { getPlayerDBWithMyRatings, type IPlayerDBWithMyRatings } from "../player-db-api";
import { PLAYER_DB_QUERY_KEYS } from "./player-db-with-my-ratings-query-key";

export function useGetPlayerDBWithMyRatings(userId: string) {
  const { data } = useSuspenseQuery<IPlayerDBWithMyRatings[]>({
    queryKey: [PLAYER_DB_QUERY_KEYS.PLAYER_DB_WITH_MY_RATINGS, userId],
    queryFn: () => getPlayerDBWithMyRatings(userId),
  });

  return data;
}
