import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type ICreateTransferRequest, createTransfer } from "@admin/admin-transfer/api/admin-transfer-api";
import { ADMIN_TRANSFER_QUERY_KEYS } from "@admin/admin-transfer/api/react-query-api/admin-transfer-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (transfer: ICreateTransferRequest) => {
      const response = await createTransfer(transfer);
      return handleSupabaseApiResponse(response, transfer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_TRANSFER_QUERY_KEYS.TRANSFERS],
      });
      toast({ content: "이적 등록을 성공했어요" });
    },
    onError: () => {
      toast({ content: "이적 등록에 실패했어요" });
    },
  });
}
