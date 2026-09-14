import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useOverlay } from "@youngduck/yd-ui/Overlays";

import { type ICreateProfileRequest, type IProfile, createProfile } from "@auth/auth-profile/api/auth-profile-api";
import { AUTH_PROFILE_QUERY_KEYS } from "@auth/auth-profile/api/react-query-api/auth-profile-query-keys";
import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";
import { handleSupabaseApiResponse } from "@shared/utils/sentry-utils";

/** RPC 가 올려주는 영문 사유를 사용자용 문구로 바꾼다 (기존에는 전부 닉네임 중복으로 안내했다) */
const getCreateProfileErrorMessage = (message: string): string => {
  if (message.includes("Nickname already exists")) return "이미 등록된 닉네임이에요";
  if (message.includes("Nickname cannot be empty")) return "닉네임을 입력해주세요";
  if (message.includes("Nickname cannot be longer")) return "닉네임은 20자까지 입력할 수 있어요";
  if (message.includes("Account no longer exists")) return "계정 정보를 찾을 수 없어요. 다시 로그인해주세요";
  return "프로필 생성에 실패했어요. 잠시 후 다시 시도해주세요";
};

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
    onError: (error: Error) => {
      toast({ content: getCreateProfileErrorMessage(error.message) });
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
