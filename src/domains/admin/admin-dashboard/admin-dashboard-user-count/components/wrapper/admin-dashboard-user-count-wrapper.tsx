/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

interface IAdminDashboardUserCountWrapper {
  children: React.ReactNode;
}

const AdminDashboardUserCountWrapper = ({ children }: IAdminDashboardUserCountWrapper) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 flex h-full w-full flex-col justify-between md:col-start-1 md:col-end-3 md:row-start-2 md:row-end-3">
      {children}
    </div>
  );
};

export default AdminDashboardUserCountWrapper;
