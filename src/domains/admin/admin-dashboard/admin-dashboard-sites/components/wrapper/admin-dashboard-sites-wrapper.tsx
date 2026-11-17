/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

interface IAdminDashboardSitesWrapper {
  children: React.ReactNode;
}

const AdminDashboardSitesWrapper = ({ children }: IAdminDashboardSitesWrapper) => {
  //SECTION HOOK호출 영역
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <Card variant="outlined" className="text-yds-s2 text-primary-100 flex h-full w-full items-center overflow-hidden">
      {children}
    </Card>
  );
};

export default AdminDashboardSitesWrapper;
