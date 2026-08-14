import { useSuspenseQuery } from "@tanstack/react-query";

import { getAllCountries } from "@admin/admin-country/api/admin-country-api";
import { ADMIN_COUNTRY_QUERY_KEYS } from "@admin/admin-country/api/react-query-api/admin-country-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useGetAllCountriesSuspense() {
  const query = useSuspenseQuery({
    queryKey: [ADMIN_COUNTRY_QUERY_KEYS.ALL_COUNTRIES],
    queryFn: async () => {
      const response = await getAllCountries();
      return handleSupabaseApiResponse(response);
    },
  });

  const { data } = query;

  return { data };
}
