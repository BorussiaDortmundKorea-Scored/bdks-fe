import { useSuspenseQueries } from "@tanstack/react-query";

import {
  type IMatchesHistoryPlayersRating,
  getMatchInfo,
  getMatchesHistoryPlayersRating,
} from "@matches/matches-history/matches-history-players-rating/api/matches-history-players-rating-api";
import { MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS } from "@matches/matches-history/matches-history-players-rating/api/react-query-api/matches-history-players-rating-query-keys";

import { type FormationLines, type IFormationPlayer } from "@shared/components/match/formation/formation-types";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetMatchesHistoryPlayersRatingSuspense(matchId: string) {
  const results = useSuspenseQueries({
    queries: [
      {
        queryKey: [MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS.MATCHES_HISTORY_PLAYERS_RATING, matchId],
        queryFn: async () => {
          const response = await getMatchesHistoryPlayersRating(matchId);
          return handleSupabaseApiResponse(response);
        },
      },
      {
        queryKey: [MATCHES_HISTORY_PLAYERS_RATING_QUERY_KEYS.MATCHES_HISTORY_PLAYERS_RATING, matchId, "info"],
        queryFn: async () => {
          const response = await getMatchInfo(matchId);
          return handleSupabaseApiResponse(response);
        },
      },
    ],
  });

  const [playersRatingQuery, matchInfoQuery] = results;

  // 최신경기(use-get-lastest-match-datas)와 같은 방식으로 라인별 그룹화까지 훅에서 끝낸다.
  // 공용 FormationBoard 가 쓰는 모양(IFormationPlayer)으로 맞춰서 내보낸다.
  const players = playersRatingQuery.data;
  const toFormationPlayer = (player: IMatchesHistoryPlayersRating): IFormationPlayer => ({
    playerId: player.player_id,
    name: player.korean_name,
    imageUrl: player.head_profile_image_url,
    rating: player.avg_rating,
    ratingCount: player.rating_count,
    isCaptain: player.is_captain,
    goals: player.goals,
    yellowCards: player.yellow_cards,
    isSentOff: player.red_card_minute !== null,
    subInMinute: player.sub_in_minute,
    subOutMinute: player.sub_out_minute,
    isBestOfTheMatch: player.botm,
  });

  // 그라운드에 있던 선수와 아닌 선수 분리
  const startingPlayers = players
    .filter((player) => player.is_playing)
    .sort((a, b) => a.position_sort_order - b.position_sort_order);

  // 선발 선수들을 라인별로 그룹화
  const playingMembers = startingPlayers.reduce((acc, player) => {
    const lineNumber = player.line_number;
    if (!acc[lineNumber]) {
      acc[lineNumber] = [];
    }
    acc[lineNumber].push(toFormationPlayer(player));
    return acc;
  }, {} as FormationLines);

  // 교체 명단: 출전후 교체 + 비출전
  const notPlayingPlayers = players.filter((player) => !player.is_playing);
  const substitutedOutPlayers = notPlayingPlayers
    .filter((player) => player.sub_out_minute !== null)
    .map(toFormationPlayer);
  const unusedPlayers = notPlayingPlayers.filter((player) => player.sub_out_minute === null).map(toFormationPlayer);

  return {
    data: players,
    playingMembers, // 그라운드에 있던 선수들 (1-5선)
    substitutedOutPlayers, // 교체로 빠진 선수들
    unusedPlayers, // 미출전 선수들
    matchInfo: matchInfoQuery.data,
  } as const;
}
