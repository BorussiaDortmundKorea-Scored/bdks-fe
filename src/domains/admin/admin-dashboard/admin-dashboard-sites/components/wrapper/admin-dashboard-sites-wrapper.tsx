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
    <div
      className={`bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 col-start-1 col-end-2 row-start-2 row-end-2 flex items-center justify-between md:col-start-4 md:col-end-7 md:row-start-2 md:row-end-3`}
    >
      {children}
    </div>
  );
};

export default AdminDashboardSitesWrapper;
