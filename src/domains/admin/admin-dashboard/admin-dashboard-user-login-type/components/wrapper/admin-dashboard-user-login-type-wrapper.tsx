/**
 * 작성자: KYD
 * 기능: 로그인 유형 대시보드 그리드 래퍼 (데스크탑 3x3, 모바일 세로 쌓기)
 */
import React from "react";

interface IAdminDashboardUserLoginTypeWrapper {
  children: React.ReactNode;
}

const AdminDashboardUserLoginTypeWrapper = ({ children }: IAdminDashboardUserLoginTypeWrapper) => {
  return (
    <div className="bg-background-tertiary text-primary-100 card-navy-50 flex h-full w-full flex-col justify-center md:col-start-1 md:col-end-4 md:row-start-3 md:row-end-5">
      {children}
    </div>
  );
};

export default AdminDashboardUserLoginTypeWrapper;
