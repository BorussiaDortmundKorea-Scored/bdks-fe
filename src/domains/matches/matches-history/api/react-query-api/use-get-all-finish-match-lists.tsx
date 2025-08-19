import { useSuspenseQuery } from "@tanstack/react-query";

import { TIME_UNIT } from "@shared/constants/time-unit";

import { type IFinishMatchList, getAllFinishMatchLists } from "@matches/matches-history/api/matches-history-api";
import { MATCHES_HISTORY_QUERY_KEYS } from "@matches/matches-history/api/react-query-api/matches-history-query-key";

export function useGetAllFinishMatchLists() {
  const { data } = useSuspenseQuery<IFinishMatchList[]>({
    queryKey: [MATCHES_HISTORY_QUERY_KEYS.ALL_FINISH_MATCH_LISTS],
    queryFn: () => getAllFinishMatchLists(),
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  return data;
}
