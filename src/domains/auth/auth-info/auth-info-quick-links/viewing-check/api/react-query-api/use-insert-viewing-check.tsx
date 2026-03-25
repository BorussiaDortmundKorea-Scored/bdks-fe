import { useMutation, useQueryClient } from "@tanstack/react-query";

import { insertViewingCheck } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/viewing-check-api";
import { VIEWING_CHECK_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/viewing-check/api/react-query-api/viewing-check-query-keys";
import { AUTH_INFO_PROFILE_CARD_QUERY_KEYS } from "@auth/auth-info/auth-info-profile-card/api/auth-info-profile-card-query-keys";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export const useInsertViewingCheck = (userId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (matchId: string) => {
      const response = await insertViewingCheck(matchId);
      return handleSupabaseApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [VIEWING_CHECK_QUERY_KEYS.VIEWING_MATCHES],
      });
      queryClient.invalidateQueries({
        queryKey: [AUTH_INFO_PROFILE_CARD_QUERY_KEYS.SUMMARY, userId],
      });
    },
  });

  return mutation;
};

