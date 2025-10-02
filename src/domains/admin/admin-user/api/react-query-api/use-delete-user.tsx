import { deleteUserByAdmin } from "../admin-user-api";
import { adminUserQueryKeys } from "./admin-user-query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserQueryKeys.users() });
    },
  });
};
