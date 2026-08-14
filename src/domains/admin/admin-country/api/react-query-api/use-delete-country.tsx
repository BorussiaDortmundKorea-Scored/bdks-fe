import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { deleteCountry } from "@admin/admin-country/api/admin-country-api";
import { ADMIN_COUNTRY_QUERY_KEYS } from "@admin/admin-country/api/react-query-api/admin-country-query-keys";

import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useDeleteCountry() {
  const queryClient = useQueryClient();
  const { toast } = useOverlay();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCountry(id);
      return handleSupabaseApiResponse(response, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ADMIN_COUNTRY_QUERY_KEYS.ALL_COUNTRIES],
      });
      toast({ content: "국가 삭제를 성공했어요" });
    },
    onError: () => {
      toast({ content: "국가 삭제에 실패했어요 (사용 중인 국가는 삭제할 수 없어요)" });
    },
  });
}
