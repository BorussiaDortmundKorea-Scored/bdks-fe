import { useSuspenseQuery } from "@tanstack/react-query";

import { getProfilePoints } from "@auth/auth-info/auth-info-point-card/api/auth-info-point-card-api";
import { AUTH_INFO_POINT_CARD_QUERY_KEYS } from "@auth/auth-info/auth-info-point-card/api/auth-info-point-card-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetProfilePointsSuspense(userId: string) {
  const { data } = useSuspenseQuery({
    queryKey: [AUTH_INFO_POINT_CARD_QUERY_KEYS.PROFILE, userId],
    queryFn: async () => {
      const response = await getProfilePoints(userId);
      return handleSupabaseApiResponse(response);
    },
  });

  return data;
}
