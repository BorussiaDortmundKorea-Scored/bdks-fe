// src/shared/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@shared/api/config/supabaseClient";
import { queryClient } from "@shared/provider/query-client";

interface DeleteAccountResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<DeleteAccountResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthStateChange = (event: string, currentSession: Session | null) => {
    console.log("인증 상태 변경:", event, currentSession);

    if (event === "SIGNED_IN" && currentSession) {
      setUser(currentSession.user);
      setSession(currentSession);
      // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 저장 불필요
      console.log("로그인 성공! Session:", currentSession);
    } else if (event === "SIGNED_OUT") {
      setUser(null);
      setSession(null);
      // React Query 캐시 정리
      queryClient.clear();
      console.log("로그아웃 완료 - 쿼리 캐시 정리됨");
    }

    setIsLoading(false);
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("로그아웃 오류:", error);
        throw error;
      }
      // React Query 캐시 정리
      queryClient.clear();
      console.log("로그아웃 완료 - 쿼리 캐시 정리됨");
    } catch (err) {
      console.error("로그아웃 예외:", err);
      throw err;
    }
  };

  // 회원탈퇴 기능
  const deleteAccount = async (): Promise<DeleteAccountResult> => {
    try {
      if (!user) {
        return {
          success: false,
          error: "로그인이 필요합니다.",
        };
      }

      // RPC 호출로 회원탈퇴 처리
      const { data, error } = await supabase.rpc("delete_user_account");

      if (error) {
        console.error("회원탈퇴 RPC 오류:", error);
        return {
          success: false,
          error: "회원탈퇴 중 오류가 발생했습니다.",
        };
      }

      // RPC 응답 확인
      if (!data.success) {
        return {
          success: false,
          error: data.error || "회원탈퇴 중 오류가 발생했습니다.",
        };
      }

      // 성공 시 로그아웃 처리
      await signOut();

      console.log("회원탈퇴 완료");
      return {
        success: true,
        message: data.message || "회원탈퇴가 완료되었습니다.",
      };
    } catch (err) {
      console.error("회원탈퇴 예외:", err);
      return {
        success: false,
        error: "회원탈퇴 중 예상치 못한 오류가 발생했습니다.",
      };
    }
  };

  useEffect(() => {
    // OAuth 콜백 처리 - URL 해시에서 access_token 추출 및 세션 설정
    const handleOAuthCallback = async () => {
      if (window.location.hash.includes("access_token")) {
        console.log("OAuth 콜백 처리 시작");

        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        console.log("URL 파라미터:", { accessToken: !!accessToken, refreshToken: !!refreshToken });

        if (accessToken && refreshToken) {
          try {
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("OAuth 세션 설정 오류:", error);
            } else if (data.session) {
              console.log("OAuth 로그인 성공:", data.session.user.email);
              // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 저장 불필요
              // 해시 제거 (URL 깔끔하게)
              window.location.hash = "";
            }
          } catch (err) {
            console.error("OAuth 콜백 처리 예외:", err);
          }
        }
      }
    };

    // 초기 세션 확인
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("초기 세션 확인 오류:", error);
          setIsLoading(false);
          return;
        }

        if (session) {
          setUser(session.user);
          setSession(session);
          // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 저장 불필요
        }
      } catch (err) {
        console.error("초기 세션 확인 예외:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // OAuth 콜백 처리 먼저 실행
    handleOAuthCallback();
    // 그 다음 초기 세션 확인
    getInitialSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => subscription.unsubscribe();
  }, []);

  // 로딩 중일 때는 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const value = {
    user,
    session,
    signOut,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다");
  }
  return context;
};

export { AuthProvider, useAuth };
