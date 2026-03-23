import { ADMIN_MATCH_LINEUP_QUERY_KEYS } from "./admin-match-lineup-query-key";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import {
  type ISubstituteMatchLineupRequest,
  substituteMatchLineup,
} from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { supabase } from "@shared/api/config/supabaseClient";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useSubstituteMatchLineup = (matchId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (payload: ISubstituteMatchLineupRequest) => {
      const response = await substituteMatchLineup(payload);
      return handleSupabaseApiResponse(response, payload);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ADMIN_MATCH_LINEUP_QUERY_KEYS.list(matchId),
      });

      // 전체 경기 채널에 라인업 변경 브로드캐스트 (subscribe 후 send)
      const allPlayersChannelName = `match-${matchId}-all-players`;
      const channel = supabase.channel(allPlayersChannelName);
      await new Promise<void>((resolve) => {
        channel.subscribe((status) => {
          if (status === "SUBSCRIBED") resolve();
        });
      });
      await channel.send({
        type: "broadcast",
        event: "lineup_updated",
        payload: { match_id: matchId, timestamp: new Date().toISOString() },
      });
      supabase.removeChannel(channel);

      toast({ content: "선수 교체를 성공했어요" });
    },
    onError: () => {
      toast({ content: "선수 교체에 실패했어요" });
    },
  });
};
