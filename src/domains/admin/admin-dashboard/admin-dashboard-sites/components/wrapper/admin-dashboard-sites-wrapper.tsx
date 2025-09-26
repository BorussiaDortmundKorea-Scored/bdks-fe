/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

interface IAdminDashboardSitesWrapper {
  children: React.ReactNode;
}

const AdminDashboardSitesWrapper: React.FC<IAdminDashboardSitesWrapper> = ({ children }) => {
  //SECTION HOOK호출 영역
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div
      className={`bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 col-start-4 col-end-7 row-start-3 row-end-5 flex h-full w-full flex-col justify-between`}
    >
      {children}
    </div>
  );
};

export default AdminDashboardSitesWrapper;
