import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type ICreateProfileRequest, type IProfile, createProfile } from "@auth/auth-profile/api/auth-profile-api";
import { getCreateProfileErrorMessage } from "@auth/auth-profile/api/auth-profile-error";
import { AUTH_PROFILE_QUERY_KEYS } from "@auth/auth-profile/api/react-query-api/auth-profile-query-keys";
import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useCreateAuthProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useOverlay();
  const { refreshProfile } = useAuth();
  const mutation = useMutation({
    mutationFn: async (player: ICreateProfileRequest): Promise<IProfile> => {
      const response = await createProfile(player);
      return handleSupabaseApiResponse(response, player);
    },
    onSuccess: async () => {
      await refreshProfile();
      queryClient.invalidateQueries({
        queryKey: [AUTH_PROFILE_QUERY_KEYS.PROFILES],
      });
      navigate(ROUTES.DASHBOARD, { replace: true });
    },
    onError: (error: unknown) => {
      toast({ content: getCreateProfileErrorMessage(error) });
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
