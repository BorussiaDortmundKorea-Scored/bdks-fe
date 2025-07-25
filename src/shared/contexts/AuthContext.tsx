// src/shared/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  nickname: string;
  favorite_player?: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // profiles 테이블에서 프로필 정보 가져오기
  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (error && error.code !== "PGRST116") {
        // PGRST116는 row가 없는 경우
        console.error("프로필 조회 오류:", error);
        return null;
      }

      return data;
    } catch (err) {
      console.error("프로필 조회 예외:", err);
      return null;
    }
  };

  // 프로필 새로고침 함수
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // profiles 테이블에서 닉네임 확인
  const checkNickname = async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from("profiles").select("nickname").eq("id", userId).single();

      if (error && error.code !== "PGRST116") {
        // PGRST116는 row가 없는 경우
        console.error("닉네임 확인 오류:", error);
        return false;
      }

      // data가 null이거나 nickname이 없으면 false
      return !!(data && data.nickname);
    } catch (err) {
      console.error("닉네임 확인 예외:", err);
      return false;
    }
  };

  // 닉네임 확인 후 리다이렉트 처리
  const handleNicknameCheck = async (currentUser: User) => {
    const hasNickname = await checkNickname(currentUser.id);

    if (!hasNickname) {
      // 현재 경로가 이미 /nickname이 아니면 리다이렉트
      if (window.location.pathname !== "/nickname") {
        console.log("닉네임이 없어서 /nickname으로 리다이렉트");
        navigate("/nickname", { replace: true });
      }
    } else {
      console.log("닉네임이 있어서 정상 처리");
      // 프로필 정보 가져오기
      const profileData = await fetchProfile(currentUser.id);
      setProfile(profileData);
    }
  };

  const handleAuthStateChange = async (event: string, currentSession: Session | null) => {
    console.log("인증 상태 변경:", event, currentSession);

    if (event === "SIGNED_IN" && currentSession) {
      setUser(currentSession.user);
      setSession(currentSession);
      // accessToken을 localStorage에 저장 (axiosAuth에서 사용)
      localStorage.setItem("access_token", currentSession.access_token);
      console.log("로그인 성공! Access Token:", currentSession.access_token);

      // 닉네임 확인 및 리다이렉트
      await handleNicknameCheck(currentSession.user);
    } else if (event === "SIGNED_OUT") {
      setUser(null);
      setSession(null);
      setProfile(null);
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
              // localStorage에 토큰 저장
              localStorage.setItem("access_token", data.session.access_token);
              // 해시 제거 (URL 깔끔하게)
              window.location.hash = "";

              // 닉네임 확인 및 리다이렉트
              await handleNicknameCheck(data.session.user);
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
          localStorage.setItem("access_token", session.access_token);

          // 닉네임 확인 및 리다이렉트
          await handleNicknameCheck(session.user);
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
  }, [navigate]);

  const value = {
    user,
    session,
    profile,
    isLoading,
    signOut,
    refreshProfile,
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
