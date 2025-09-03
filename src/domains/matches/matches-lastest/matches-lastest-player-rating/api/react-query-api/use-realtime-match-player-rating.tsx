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

    console.log("🔗 브로드캐스트 구독 시작:", {
      channelName,
      matchId,
      playerId,
    });

    const channel = supabase
      .channel(channelName)
      .on("broadcast", { event: "rating_updated" }, (payload) => {
        console.log("📢 브로드캐스트 수신!", {
          payload: payload.payload,
          timestamp: new Date().toISOString(),
        });

        // React Query 캐시 무효화로 자동 재조회
        queryClient.invalidateQueries({
          queryKey: [MATCHES_LASTEST_PLAYER_RATING_QUERY_KEYS.MATCH_PLAYER_RATING, matchId, playerId],
        });

        console.log("🔄 데이터 새로고침 요청 완료");
      })
      .subscribe((status) => {
        console.log("📡 브로드캐스트 구독 상태:", status);
      });

    return () => {
      console.log("🔌 브로드캐스트 구독 해제:", channelName);
      supabase.removeChannel(channel);
    };
  }, [matchId, playerId, queryClient]);

  return query;
};
