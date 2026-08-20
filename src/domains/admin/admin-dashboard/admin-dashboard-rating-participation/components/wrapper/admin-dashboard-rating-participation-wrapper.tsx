/**
 * 작성자: KYD
 * 기능: 평점 참여율 통계 카드 래퍼
 */
import React from "react";

interface IAdminDashboardRatingParticipationWrapper {
  children: React.ReactNode;
}

const AdminDashboardRatingParticipationWrapper = ({ children }: IAdminDashboardRatingParticipationWrapper) => {
  return (
    <div className="bg-background-tertiary text-yds-s2 text-primary-100 card-navy-50 flex h-full w-full flex-col justify-between md:col-start-5 md:col-end-7 md:row-start-1 md:row-end-2">
      {children}
    </div>
  );
};

export default AdminDashboardRatingParticipationWrapper;
