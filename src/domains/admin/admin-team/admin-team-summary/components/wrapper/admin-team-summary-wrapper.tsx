/**
 * 작성자: KYD
 * 기능: 팀 현황 요약 카드 공통 레이아웃 쉘 (본체 / 스켈레톤 / 에러 공통)
 * 프로세스 설명: 대시보드 "회원 수" 카드와 같은 Card(outlined) 모양. 그리드 위치는 admin-team-page 가 정한다.
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

interface IAdminTeamSummaryWrapperProps {
  children: React.ReactNode;
}

const AdminTeamSummaryWrapper = ({ children }: IAdminTeamSummaryWrapperProps) => {
  return (
    <Card variant="outlined" className="text-primary-100 flex h-full w-full flex-col gap-3">
      <h2 className="text-yds-s2">팀 현황</h2>
      {children}
    </Card>
  );
};

export default AdminTeamSummaryWrapper;
