import { useSuspenseQuery } from "@tanstack/react-query";

import { type IFinishMatchList, getAllFinishMatchLists } from "@matches/matches-history/api/matches-history-api";
import { MATCHES_HISTORY_QUERY_KEYS } from "@matches/matches-history/api/react-query-api/matches-history-query-key";

import { TIME_UNIT } from "@shared/constants/time-unit";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAllFinishMatchLists() {
  const { data } = useSuspenseQuery<IFinishMatchList[]>({
    queryKey: [MATCHES_HISTORY_QUERY_KEYS.ALL_FINISH_MATCH_LISTS],
    queryFn: async () => {
      const response = await getAllFinishMatchLists();
      return handleSupabaseApiResponse(response);
    },
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  return data;
}
