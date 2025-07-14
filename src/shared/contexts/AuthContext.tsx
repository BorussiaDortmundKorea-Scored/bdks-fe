// src/shared/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../api/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
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
      // accessToken을 localStorage에 저장 (axiosAuth에서 사용)
      localStorage.setItem("access_token", currentSession.access_token);
      console.log("로그인 성공! Access Token:", currentSession.access_token);
    } else if (event === "SIGNED_OUT") {
      setUser(null);
      setSession(null);
      // localStorage에서 토큰 제거
      localStorage.removeItem("access_token");
      console.log("로그아웃 완료");
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
    } catch (err) {
      console.error("로그아웃 예외:", err);
      throw err;
    }
  };

  useEffect(() => {
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
          localStorage.setItem("access_token", session.access_token);
        }
      } catch (err) {
        console.error("초기 세션 확인 예외:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // 인증 상태 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    isLoading,
    signOut,
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
