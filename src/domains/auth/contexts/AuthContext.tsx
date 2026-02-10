// src/shared/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { Session, User } from "@supabase/supabase-js";

import type { IProfile } from "@auth/auth-profile/api/auth-profile-api";

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
  profile: IProfile | null;
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
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthStateChange = (event: string, currentSession: Session | null) => {
    if (event === "SIGNED_IN" && currentSession) {
      setUser(currentSession.user);
      setSession(currentSession);
      // 프로필 정보 로드
      void loadProfile(currentSession.user.id);
      // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 저장 불필요
    } else if (event === "SIGNED_OUT") {
      setUser(null);
      setSession(null);
      setProfile(null);
      // React Query 캐시 정리
      queryClient.clear();
    }

    setIsLoading(false);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
    // React Query 캐시 정리
    queryClient.clear();
  };

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

      if (error) {
        setProfile(null);
        return;
      }

      setProfile((data as IProfile) ?? null);
    } catch {
      setProfile(null);
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

      return {
        success: true,
        message: data.message || "회원탈퇴가 완료되었습니다.",
      };
    } catch {
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
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          window.history.replaceState(null, "", window.location.pathname + window.location.search);
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
          setIsLoading(false);
          return;
        }

        if (session) {
          setUser(session.user);
          setSession(session);
          // Supabase가 자동으로 sb-xxx-auth-token을 관리하므로 별도 저장 불필요
          await loadProfile(session.user.id);
        }
      } catch {
        // 초기 세션 확인 예외 무시
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
    profile,
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
