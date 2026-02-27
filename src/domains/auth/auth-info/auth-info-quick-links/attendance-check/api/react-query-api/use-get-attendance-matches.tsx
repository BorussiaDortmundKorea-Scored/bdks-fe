import { useSuspenseQuery } from "@tanstack/react-query";

import { getAttendanceMatches } from "@auth/auth-info/auth-info-quick-links/attendance-check/api/attendance-check-api";
import { ATTENDANCE_CHECK_QUERY_KEYS } from "@auth/auth-info/auth-info-quick-links/attendance-check/api/react-query-api/attendance-check-query-keys";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAttendanceMatches() {
  const query = useSuspenseQuery({
    queryKey: [ATTENDANCE_CHECK_QUERY_KEYS.ATTENDANCE_MATCHES],
    queryFn: async () => {
      const response = await getAttendanceMatches();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}

