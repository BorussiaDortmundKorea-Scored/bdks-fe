// src/shared/hooks/useKakaoLogin.ts
import { useState } from "react";

import { supabase } from "@shared/api/config/supabaseClient";

interface LoginResult {
  success: boolean;
  error?: string;
  user?: unknown;
  session?: unknown;
}

const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signinWithKakao = async (): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const redirectUrl = `${baseUrl}/dashboard`;


      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            scope: "profile_nickname profile_image account_email",
          },
        },
      });

      if (error) {
        return {
          success: false,
          error: `카카오 로그인 중 문제가 발생했습니다: ${error.message}`,
        };
      }

      // OAuth 로그인은 리다이렉트되므로 여기서는 성공 상태만 반환
      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "카카오 로그인 중 예상치 못한 오류가 발생했습니다.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 세션 확인 및 accessToken 가져오기
  const getCurrentSession = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        return null;
      }

      if (session) {
        // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 저장 불필요
        return session;
      }

      return null;
    } catch {
      return null;
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return false;
      }

      // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 제거 불필요
      return true;
    } catch {
      return false;
    }
  };

  // 사용자 상태 변경 감지
  const onAuthStateChange = (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  };

  return {
    signinWithKakao,
    getCurrentSession,
    signOut,
    onAuthStateChange,
    isLoading,
  };
};

export default useKakaoLogin;
