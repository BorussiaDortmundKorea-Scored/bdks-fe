import { getAllUsers } from "../admin-user-api";
import { adminUserQueryKeys } from "./admin-user-query-keys";
import { useSuspenseQuery } from "@tanstack/react-query";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useGetAllUsersSuspense = () => {
  return useSuspenseQuery({
    queryKey: adminUserQueryKeys.users(),
    queryFn: async () => {
      const response = await getAllUsers();
      return handleSupabaseApiResponse(response);
    },
  });
};
