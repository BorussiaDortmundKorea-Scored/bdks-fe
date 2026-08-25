/**
 * 작성자: KYD
 * 기능: 탈퇴 회원 통계 카드 래퍼
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

interface IAdminDashboardDeletedUsersWrapper {
  children: React.ReactNode;
}

const AdminDashboardDeletedUsersWrapper = ({ children }: IAdminDashboardDeletedUsersWrapper) => {
  return (
    <Card
      variant="outlined"
      className="text-yds-s2 text-primary-100 flex h-full w-full flex-col justify-between md:col-start-3 md:col-end-5 md:row-start-1 md:row-end-2"
    >
      {children}
    </Card>
  );
};

export default AdminDashboardDeletedUsersWrapper;
