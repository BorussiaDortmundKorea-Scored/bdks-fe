import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { toggleTransferReaction } from "@auth/auth-info/auth-info-quick-links/transfer-market/api/transfer-market-api";
import { TRANSFER_MARKET_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/transfer-market/api/react-query-api/transfer-market-query-keys";

import { type TransferReaction } from "@shared/types/entities/transfer.entity";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useToggleTransferReaction() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (params: { transferId: string; reaction: TransferReaction }) => {
      const response = await toggleTransferReaction(params.transferId, params.reaction);
      return handleSupabaseApiResponse(response, params);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [TRANSFER_MARKET_QUERY_KEYS.TRANSFERS] });

      // 토글 결과로 남김/취소 구분
      if (!data || data.my_reaction === null) {
        toast({ content: "반응을 취소했어요" });
      } else {
        toast({ content: variables.reaction === "LIKE" ? "좋아요를 남겼어요 👍" : "싫어요를 남겼어요 👎" });
      }
    },
    onError: () => {
      toast({ content: "반응 처리에 실패했어요" });
    },
  });
}
