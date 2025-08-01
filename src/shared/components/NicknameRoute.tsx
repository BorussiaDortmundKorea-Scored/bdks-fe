// src/shared/components/NicknameRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../domains/auth/contexts/AuthContext";

const NicknameRoute = () => {
  const { user } = useAuth();

  // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 로그인된 사용자 자식 컴포넌트 렌더링
  return <Outlet />;
};

export default NicknameRoute;
