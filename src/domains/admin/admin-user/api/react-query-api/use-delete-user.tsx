import { deleteUserByAdmin } from "../admin-user-api";
import { adminUserQueryKeys } from "./admin-user-query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await deleteUserByAdmin(userId);
      return handleSupabaseApiResponse(response, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.users() });
      toast({ content: "사용자 탈퇴를 성공했어요" });
    },
    onError: () => {
      toast({ content: "사용자 탈퇴에 실패했어요" });
    },
  });
};
