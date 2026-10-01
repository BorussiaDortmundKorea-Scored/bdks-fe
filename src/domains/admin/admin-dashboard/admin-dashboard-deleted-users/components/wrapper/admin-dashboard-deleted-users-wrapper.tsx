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
      className="text-yds-s2 text-primary-100 flex h-full w-full flex-col justify-between xl:col-start-3 xl:col-end-5 xl:row-start-1 xl:row-end-2"
    >
      <h2>누적 탈퇴 회원</h2>
      {children}
    </Card>
  );
};

export default AdminDashboardDeletedUsersWrapper;
