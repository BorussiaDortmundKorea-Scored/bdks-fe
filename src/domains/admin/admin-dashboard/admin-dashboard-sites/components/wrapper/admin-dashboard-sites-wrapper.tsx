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
    <Card
      variant="outlined"
      className="text-yds-s2 text-primary-100 flex items-center overflow-hidden md:col-start-5 md:col-end-9 md:row-start-1 md:row-end-2"
    >
      {children}
    </Card>
  );
};

export default AdminDashboardSitesWrapper;
