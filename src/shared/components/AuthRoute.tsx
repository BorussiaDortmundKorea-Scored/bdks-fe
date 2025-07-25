// src/shared/components/AuthRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthRoute = () => {
  const { user, isLoading, profile } = useAuth();

  // 로딩 중일 때는 로딩 화면 표시
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 로그인되지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 로그인된 사용자는 자식 컴포넌트 렌더링
  return <Outlet />;
};

export default AuthRoute;
