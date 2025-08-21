// src/domains/matches/matches-lastest/api/react-query-api/use-get-latest-match-datas.tsx
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
        staleTime: TIME_UNIT.ONE_SECOND * 30, // 실시간 평점이므로 짧게
        gcTime: TIME_UNIT.ONE_SECOND * 30,
      },
      {
        queryKey: [MATCHES_LASTEST_QUERY_KEYS.LATEST_MATCH_INFORMATION],
        queryFn: () => getLatestMatchInformation(),
        staleTime: TIME_UNIT.ONE_MINUTE * 5, // 정적 데이터이므로 길게
        gcTime: TIME_UNIT.ONE_MINUTE * 5,
      },
    ],
  });

  const [formationResult, informationResult] = results;

  // 선발과 후보 분리
  const startingPlayers = formationResult.data.filter((player) => player.is_playing);
  const benchPlayers = formationResult.data.filter((player) => !player.is_playing);

  // 선발 선수들을 라인별로 그룹화
  const playingMembers = startingPlayers.reduce(
    (acc, player) => {
      const lineNumber = player.line_number;
      if (!acc[lineNumber]) {
        acc[lineNumber] = [];
      }
      acc[lineNumber].push(player);
      return acc;
    },
    {} as Record<number, IMatchesLastestPlayer[]>,
  );

  // 후보 선수들을 라인별로 그룹화
  const notPlayingMembers = benchPlayers.reduce(
    (acc, player) => {
      const lineNumber = player.line_number;
      if (!acc[lineNumber]) {
        acc[lineNumber] = [];
      }
      acc[lineNumber].push(player);
      return acc;
    },
    {} as Record<number, IMatchesLastestPlayer[]>,
  );

  return {
    playingMembers, // 현재 뛰고 있는 선수들 (1-5선)
    notPlayingMembers, // 후보 선수들
    information: informationResult.data as IMatchesLastestInformation,
  };
}
