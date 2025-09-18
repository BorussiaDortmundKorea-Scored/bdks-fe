import { useNavigate } from "react-router-dom";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { type ICreateProfileRequest, type IProfile, createProfile } from "@auth/auth-profile/api/auth-profile-api";
import { AUTH_PROFILE_QUERY_KEYS } from "@auth/auth-profile/api/react-query-api/auth-profile-query-keys";

export function useCreateAuthProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async (player: ICreateProfileRequest): Promise<IProfile> => {
      const response = await createProfile(player);
      // Supabase 응답은 성공 HTTP 상태에서도 error 필드가 채워질 수 있음
      // (권한/제약 조건 위반 등). error가 있으면 throw하여 React Query onError로 전달.
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AUTH_PROFILE_QUERY_KEYS.PROFILES],
      });
      navigate("/dashboard", { replace: true });
    },
    onError: (error: Error) => {
      console.error("Failed to create auth profile:", error);
      alert(`프로필 등록 실패: ${error.message}`);
    },
  });

  const { mutateAsync, isPending } = mutation;

  return { mutateAsync, isPending };
}
