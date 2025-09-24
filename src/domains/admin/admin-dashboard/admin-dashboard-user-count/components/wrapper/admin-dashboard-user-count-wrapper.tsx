/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import React from "react";

interface IAdminDashboardUserCountWrapper {
  children: React.ReactNode;
}

const AdminDashboardUserCountWrapper: React.FC<IAdminDashboardUserCountWrapper> = ({ children }) => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 col-start-1 col-end-3 row-start-2 row-end-3 flex h-full w-full flex-col justify-between">
      {children}
    </div>
  );
};

export default AdminDashboardUserCountWrapper;
