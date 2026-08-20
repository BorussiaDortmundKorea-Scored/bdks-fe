/**
 * 작성자: KYD
 * 기능: 경기별 평점 참여율 카드 래퍼 (하단 전체 폭)
 */
import React from "react";

interface IAdminDashboardMatchCoverageWrapper {
  children: React.ReactNode;
}

const AdminDashboardMatchCoverageWrapper = ({ children }: IAdminDashboardMatchCoverageWrapper) => {
  return (
    <div className="bg-background-tertiary text-primary-100 card-navy-50 flex h-full w-full flex-col justify-center gap-2 md:col-start-1 md:col-end-9 md:row-start-7 md:row-end-9">
      {children}
    </div>
  );
};

export default AdminDashboardMatchCoverageWrapper;
