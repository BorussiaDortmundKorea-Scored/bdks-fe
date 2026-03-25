import { useNavigate } from "react-router-dom";

import { useOverlay } from "@youngduck/yd-ui/Overlays";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type IUpdateProfileRequest, updateProfile } from "@auth/auth-info/auth-info-edit-profile/api/auth-info-edit-profile-api";
import { AUTH_INFO_PROFILE_CARD_QUERY_KEYS } from "@auth/auth-info/auth-info-profile-card/api/auth-info-profile-card-query-keys";
import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";
import { type IProfileEntity } from "@shared/types/entities/profile.entity";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useOverlay();
  const { user, refreshProfile } = useAuth();

  const mutation = useMutation({
    mutationFn: async (profile: IUpdateProfileRequest): Promise<IProfileEntity> => {
      const response = await updateProfile(user!.id, profile);
      return handleSupabaseApiResponse(response, profile);
    },
    onSuccess: async () => {
      await refreshProfile();
      queryClient.invalidateQueries({
        queryKey: [AUTH_INFO_PROFILE_CARD_QUERY_KEYS.SUMMARY],
      });
      toast({ content: "프로필이 수정되었습니다." });
      navigate(ROUTES.MY_INFO, { replace: true });
    },
    onError: () => {
      toast({ content: "이미 등록된 닉네임이에요" });
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
