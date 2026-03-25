import { useSuspenseQuery } from "@tanstack/react-query";

import { getProfileSummary } from "@auth/auth-info/auth-info-profile-card/api/auth-info-profile-card-api";
import { AUTH_INFO_PROFILE_CARD_QUERY_KEYS } from "@auth/auth-info/auth-info-profile-card/api/auth-info-profile-card-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetProfileSummarySuspense(userId: string) {
  const { data } = useSuspenseQuery({
    queryKey: [AUTH_INFO_PROFILE_CARD_QUERY_KEYS.SUMMARY, userId],
    queryFn: async () => {
      const response = await getProfileSummary(userId);
      return handleSupabaseApiResponse(response);
    },
  });

  return data;
}
