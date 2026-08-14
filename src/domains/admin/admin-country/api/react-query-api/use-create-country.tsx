import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type ICreateCountryRequest, createCountry } from "@admin/admin-country/api/admin-country-api";
import { ADMIN_COUNTRY_QUERY_KEYS } from "@admin/admin-country/api/react-query-api/admin-country-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useCreateCountry() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (country: ICreateCountryRequest) => {
      const response = await createCountry(country);
      return handleSupabaseApiResponse(response, country);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COUNTRY_QUERY_KEYS.ALL_COUNTRIES],
      });
      toast({ content: "국가 추가를 성공했어요" });
    },
    onError: () => {
      toast({ content: "국가 추가에 실패했어요 (이미 존재하는 국가일 수 있어요)" });
    },
  });
}
