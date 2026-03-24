/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

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
    <div className="bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 flex items-center md:col-start-5 md:col-end-9 md:row-start-1 md:row-end-2">
      {children}
    </div>
  );
};

export default AdminDashboardSitesWrapper;
