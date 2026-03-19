// src/shared/hooks/useAnonymousLogin.ts
import { useState } from "react";
import { supabase } from "@shared/api/config/supabaseClient";

interface LoginResult {
  success: boolean;
  error?: string;
}

const useAnonymousLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signinAnonymously = async (): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInAnonymously();

      if (error) {
        return {
          success: false,
          error: `익명 로그인 중 문제가 발생했습니다: ${error.message}`,
        };
      }

      return {
        success: true,
      };
    } catch {
      return {
        success: false,
        error: "익명 로그인 중 예상치 못한 오류가 발생했습니다.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signinAnonymously,
    isLoading,
  };
};

export default useAnonymousLogin;
