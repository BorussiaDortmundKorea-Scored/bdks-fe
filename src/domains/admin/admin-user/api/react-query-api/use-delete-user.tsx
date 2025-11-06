import { deleteUserByAdmin } from "../admin-user-api";
import { adminUserQueryKeys } from "./admin-user-query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await deleteUserByAdmin(userId);
      return handleSupabaseApiResponse(response, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.users() });
    },
  });
};
