import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { deleteTransfer } from "@admin/admin-transfer/api/admin-transfer-api";
import { ADMIN_TRANSFER_QUERY_KEYS } from "@admin/admin-transfer/api/react-query-api/admin-transfer-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useDeleteTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteTransfer(id);
      return handleSupabaseApiResponse(response, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_TRANSFER_QUERY_KEYS.TRANSFERS],
      });
      toast({ content: "이적 삭제를 성공했어요" });
    },
    onError: () => {
      toast({ content: "이적 삭제에 실패했어요" });
    },
  });
}
