// src/shared/components/AuthRoute.tsx
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@auth/contexts/AuthContext";

import { supabase } from "@shared/api/config/supabaseClient";
import PageLoading from "@shared/components/loading/page-loading";

const AuthRoute = () => {
  const { user } = useAuth();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  // profile 값 확인
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

        if (error) {
          return;
        }

        setHasProfile(!!data);
      
    };

    checkProfile();
  }, [user]);

  // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // profile 확인 중일 때는 로딩 표시
  if (hasProfile === null) {
    return <PageLoading />;
  }

  // profile이 없으면 닉네임 설정 페이지로 리다이렉트
  if (!hasProfile) {
    return <Navigate to="/auth/profile" replace />;
  }

  // 로그인된 사용자이고 profile도 있는 경우 자식 컴포넌트 렌더링
  return <Outlet />;
};

export default AuthRoute;
