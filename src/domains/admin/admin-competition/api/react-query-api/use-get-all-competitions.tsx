import { useSuspenseQuery } from "@tanstack/react-query";

import { TIME_UNIT } from "@shared/constants/time-unit";

import { type ICompetition, getAllCompetitions } from "@admin/admin-competition/api/admin-competition-api";
import { ADMIN_COMPETITION_QUERY_KEYS } from "@admin/admin-competition/api/react-query-api/admin-competition-query-keys";

export function useGetAllCompetitions() {
  const { data } = useSuspenseQuery<ICompetition[]>({
    queryKey: [ADMIN_COMPETITION_QUERY_KEYS.ALL_COMPETITIONS],
    queryFn: () => getAllCompetitions(),
    staleTime: TIME_UNIT.ONE_MINUTE * 5,
    gcTime: TIME_UNIT.ONE_MINUTE * 5,
  });

  return data;
}
