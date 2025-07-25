// src/shared/components/AuthRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../api/supabaseClient";

const AuthRoute = () => {
  const { user } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  // profile 값 확인
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

        if (error) {
          console.error("프로필 조회 오류:", error);
          return;
        }

        setHasProfile(!!data);
      } catch (err) {
        console.error("프로필 조회 예외:", err);
      }
    };

    checkProfile();
  }, [user]);

  // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // profile 확인 중일 때는 로딩 표시
  if (hasProfile === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // profile이 없으면 닉네임 설정 페이지로 리다이렉트
  if (!hasProfile) {
    return <Navigate to="/nickname" replace />;
  }

  // 로그인된 사용자이고 profile도 있는 경우 자식 컴포넌트 렌더링
  return <Outlet />;
};

export default AuthRoute;
