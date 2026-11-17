/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 조회 React Query 훅
 * 프로세스 설명: 같은 폴더의 useGetAllTeamsSuspense 와 같은 모양({ data })으로 돌려준다.
 */
import { useSuspenseQuery } from "@tanstack/react-query";

import { getTeamCountByCountry } from "@admin/admin-team/api/admin-team-country-count-api";
import { ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY } from "@admin/admin-team/api/react-query-api/admin-team-country-count-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetTeamCountByCountrySuspense() {
  const { data } = useSuspenseQuery({
    queryKey: ADMIN_TEAM_COUNTRY_COUNT_QUERY_KEY,
    queryFn: async () => {
      const response = await getTeamCountByCountry();
      return handleSupabaseApiResponse(response);
    },
  });

  return { data };
}
