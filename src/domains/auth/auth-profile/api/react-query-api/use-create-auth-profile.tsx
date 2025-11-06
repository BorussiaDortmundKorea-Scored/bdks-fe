import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreateProfileRequest, type IProfile, createProfile } from "@auth/auth-profile/api/auth-profile-api";
import { AUTH_PROFILE_QUERY_KEYS } from "@auth/auth-profile/api/react-query-api/auth-profile-query-keys";

import { ROUTES } from "@shared/constants/routes";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useCreateAuthProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (player: ICreateProfileRequest): Promise<IProfile> => {
      const response = await createProfile(player);
      return handleSupabaseApiResponse(response, player);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AUTH_PROFILE_QUERY_KEYS.PROFILES],
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: () => {
      alert(`이미 등록된 닉네임이에요`);
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
