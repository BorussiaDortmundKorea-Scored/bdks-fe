import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type IUpdateCountryRequest, updateCountry } from "@admin/admin-country/api/admin-country-api";
import { ADMIN_COUNTRY_QUERY_KEYS } from "@admin/admin-country/api/react-query-api/admin-country-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useUpdateCountry() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (country: IUpdateCountryRequest) => {
      const response = await updateCountry(country);
      return handleSupabaseApiResponse(response, country);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COUNTRY_QUERY_KEYS.ALL_COUNTRIES],
      });
      toast({ content: "국가 수정을 성공했어요" });
    },
    onError: () => {
      toast({ content: "국가 수정에 실패했어요" });
    },
  });
}
