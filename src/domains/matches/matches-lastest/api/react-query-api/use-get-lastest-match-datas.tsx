import { useSuspenseQueries } from "@tanstack/react-query";

import { TIME_UNIT } from "@shared/constants/time-unit";

import {
  type IMatchesLastestInformation,
  type IMatchesLastestPlayer,
  getLatestMatchInformation,
  getLatestMatchLiveFormation,
} from "@matches/matches-lastest/api/matches-lastest-api";
import { MATCHES_LASTEST_QUERY_KEYS } from "@matches/matches-lastest/api/react-query-api/matches-lastest-query-key";

export function useGetLatestMatchDatas() {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: [MATCHES_LASTEST_QUERY_KEYS.LATEST_MATCH_LIVE_FORMATION],
        queryFn: () => getLatestMatchLiveFormation(),
        staleTime: TIME_UNIT.ONE_MINUTE * 5,
        gcTime: TIME_UNIT.ONE_MINUTE * 5,
      },
      {
        queryKey: [MATCHES_LASTEST_QUERY_KEYS.LATEST_MATCH_INFORMATION],
        queryFn: () => getLatestMatchInformation(),
        staleTime: TIME_UNIT.ONE_MINUTE * 5,
        gcTime: TIME_UNIT.ONE_MINUTE * 5,
      },
    ],
  });

  const [formationResult, informationResult] = results;

  return {
    formation: formationResult.data as IMatchesLastestPlayer[],
    information: informationResult.data as IMatchesLastestInformation,
  };
}
