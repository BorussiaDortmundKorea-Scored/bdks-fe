/**
 * 작성자: KYD
 * 기능: 로그인 유형 대시보드 카드 래퍼 (위치는 admin-dashboard-page 에서 정한다)
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

interface IAdminDashboardUserLoginTypeWrapper {
  children: React.ReactNode;
}

const AdminDashboardUserLoginTypeWrapper = ({ children }: IAdminDashboardUserLoginTypeWrapper) => {
  return (
    <Card variant="outlined" className="text-primary-100 flex h-full w-full flex-col justify-center">
      <h2 className="text-yds-s2 mb-4">회원 유형</h2>
      {children}
    </Card>
  );
};

export default AdminDashboardUserLoginTypeWrapper;
