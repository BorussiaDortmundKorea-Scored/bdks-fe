import { getAllUsers } from "../admin-user-api";
import { adminUserQueryKeys } from "./admin-user-query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetAllUsersSuspense = () => {
  return useSuspenseQuery({
    queryKey: adminUserQueryKeys.users(),
    queryFn: async () => {
      const response = await getAllUsers();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data;
    },
  });
};
