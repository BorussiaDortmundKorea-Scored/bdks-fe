/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 카드 공통 레이아웃 쉘 (본체 / 스켈레톤 / 에러 공통)
 * 프로세스 설명: 대시보드 차트 카드와 같은 Card(outlined) 모양. 그리드 위치는 admin-team-page 가 정하고,
 *              이 쉘은 받은 칸을 채우기만 한다. 차트 영역은 남는 높이를 채운다(데스크톱 flex-1, 모바일 160px).
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

interface IAdminTeamCountryCountWrapperProps {
  /** 제목 우측 보조 문구 (예: 정렬 기준 "팀 많은 순") */
  summary?: React.ReactNode;
  children: React.ReactNode;
}

const AdminTeamCountryCountWrapper = ({ summary, children }: IAdminTeamCountryCountWrapperProps) => {
  return (
    <Card variant="outlined" className="text-primary-100 flex h-full w-full flex-col gap-2">
      <div className="flex w-full items-center justify-between">
        <span className="text-yds-s2 text-primary-100">국가별 팀 수</span>
        {summary}
      </div>
      <div className="h-[160px] w-full xl:h-auto xl:min-h-0 xl:flex-1">{children}</div>
    </Card>
  );
};

export default AdminTeamCountryCountWrapper;
