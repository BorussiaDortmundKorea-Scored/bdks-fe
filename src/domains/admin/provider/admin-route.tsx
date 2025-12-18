/**
 * 작성자: KYD
 * 기능: 관리자 전용 라우트 가드
 * 프로세스 설명: Supabase profiles.is_admin 값에 따라 관리자 페이지 접근 권한을 제어
 */
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@auth/contexts/AuthContext";

import { ROUTES } from "@shared/constants/routes";

const AdminRoute = () => {
  const { user, profile } = useAuth();

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // 프로필이 아직 로드되지 않았을 때 간단한 로딩 처리
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  // 관리자 권한이 아닌 경우 대시보드로 리다이렉트
  if (!profile.is_admin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // 관리자 권한이 있는 경우 자식 라우트 렌더링
  return <Outlet />;
};

export default AdminRoute;
