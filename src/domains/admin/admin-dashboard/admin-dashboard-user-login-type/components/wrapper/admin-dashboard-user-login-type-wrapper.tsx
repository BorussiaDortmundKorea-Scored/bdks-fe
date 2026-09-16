/**
 * 작성자: KYD
 * 기능: 로그인 유형 대시보드 그리드 래퍼 (데스크탑 3x3, 모바일 세로 쌓기)
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

interface IAdminDashboardUserLoginTypeWrapper {
  children: React.ReactNode;
}

const AdminDashboardUserLoginTypeWrapper = ({ children }: IAdminDashboardUserLoginTypeWrapper) => {
  return (
    <Card
      variant="outlined"
      className="text-primary-100 flex h-full w-full flex-col justify-center md:col-start-1 md:col-end-4 md:row-start-2 md:row-end-4"
    >
      <h2 className="text-yds-s2 mb-4">회원 유형</h2>
      {children}
    </Card>
  );
};

export default AdminDashboardUserLoginTypeWrapper;
