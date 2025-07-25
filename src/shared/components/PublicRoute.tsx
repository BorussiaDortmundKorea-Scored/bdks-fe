// src/shared/components/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  // 이미 로그인된 사용자는 대시보드로 리다이렉트
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // 로그인되지 않은 사용자는 자식 컴포넌트 렌더링
  return <Outlet />;
};

export default PublicRoute;
