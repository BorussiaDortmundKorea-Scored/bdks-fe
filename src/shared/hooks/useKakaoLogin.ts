// src/shared/hooks/useKakaoLogin.ts
import { useState } from "react";
import { supabase } from "../api/supabaseClient";

interface LoginResult {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}

const useKakaoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signinWithKakao = async (): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            // 카카오에서 추가 정보를 요청할 수 있습니다
            scope: "profile_nickname profile_image account_email",
          },
        },
      });

      if (error) {
        console.error("카카오 로그인 오류:", error);
        return {
          success: false,
          error: `카카오 로그인 중 문제가 발생했습니다: ${error.message}`,
        };
      }

      // OAuth 로그인은 리다이렉트되므로 여기서는 성공 상태만 반환
      return {
        success: true,
      };
    } catch (err) {
      console.error("카카오 로그인 예외:", err);
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
        console.error("세션 확인 오류:", error);
        return null;
      }

      if (session) {
        // accessToken을 localStorage에 저장 (axiosAuth에서 사용)
        localStorage.setItem("access_token", session.access_token);
        return session;
      }

      return null;
    } catch (err) {
      console.error("세션 확인 예외:", err);
      return null;
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("로그아웃 오류:", error);
        return false;
      }

      // localStorage에서 토큰 제거
      localStorage.removeItem("access_token");
      return true;
    } catch (err) {
      console.error("로그아웃 예외:", err);
      return false;
    }
  };

  // 사용자 상태 변경 감지
  const onAuthStateChange = (callback: (event: string, session: any) => void) => {
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
