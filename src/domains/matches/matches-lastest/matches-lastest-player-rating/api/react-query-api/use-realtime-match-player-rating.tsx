// src/domains/matches/matches-lastest/matches-lastest-player-rating/api/react-query-api/use-realtime-match-player-rating.tsx
import { useEffect } from "react";

import { MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS } from "./matches-lastest-player-rating-query-keys";
import { useGetMatchPlayerRating } from "./use-get-match-player-rating";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@shared/api/config/supabaseClient";

interface UseRealtimeMatchPlayerRatingProps {
  matchId: string;
  playerId: string;
}

export const useRealtimeMatchPlayerRating = ({ matchId, playerId }: UseRealtimeMatchPlayerRatingProps) => {
  const queryClient = useQueryClient();
  const query = useGetMatchPlayerRating({ matchId, playerId });

  // broadcast 방식 실시간 구독
  useEffect(() => {
    const channelName = `match-${matchId}-player-${playerId}`;

    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "rating_updated" }, () => {
        queryClient.invalidateQueries({
          queryKey: [MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS.MATCH_PLAYER_RATING, matchId, playerId],
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId, playerId, queryClient]);

  return query;
};
