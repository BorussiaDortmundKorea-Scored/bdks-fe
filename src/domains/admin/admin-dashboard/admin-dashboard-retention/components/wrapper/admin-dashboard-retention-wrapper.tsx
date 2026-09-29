/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 카드 공통 레이아웃 쉘 (본체/스켈레톤/에러 공용)
 */
import React from "react";

import { Card } from "@youngduck/yd-ui/Cards";

/** 대시보드 그리드 배치 클래스 (본체 / 스켈레톤 / 에러 공통) */
export const RETENTION_CARD_CLASS =
  "text-primary-100 h-full w-full xl:col-start-1 xl:col-end-5 xl:row-start-7 xl:row-end-9";

/**
 * 차트 높이를 픽셀로 고정한다 (본체 / 스켈레톤 공통).
 *
 * 대시보드 그리드는 `xl:grid-rows-8` + 좌측 nav 의 `min-h-[876px]` 로 1행이 약 91.5px 이고,
 * 이 카드는 2행(row 7~9)이라 카드 전체가 약 199px 다. 높이를 안 주면 Chart.js 가 기본 종횡비로
 * 220px 쯤을 잡아 카드가 2행을 넘고, `minmax(0,1fr)` 행들이 그 높이에 맞춰 전부 늘어난다
 * (= 대시보드 전체 행 높이가 길어진다). 그래서 flex-1 대신 고정 높이를 쓴다.
 */
export const RETENTION_CHART_BOX_CLASS = "h-[128px] w-full shrink-0";

interface IAdminDashboardRetentionWrapper {
  children: React.ReactNode;
  /** 제목 우측 요약 영역 (평균 참여율 등) */
  summary?: React.ReactNode;
}

const AdminDashboardRetentionWrapper = ({ children, summary }: IAdminDashboardRetentionWrapper) => {
  return (
    <Card variant="outlined" className={`${RETENTION_CARD_CLASS} flex flex-col gap-2`}>
      <div className="flex w-full items-center justify-between">
        <span className="text-yds-s2 text-primary-100">회원 리텐션</span>
        {summary}
      </div>
      {children}
    </Card>
  );
};

export default AdminDashboardRetentionWrapper;
