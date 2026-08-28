/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 카드 공통 레이아웃 쉘(스켈레톤/에러용) + 그리드 배치 클래스 공유
 * 프로세스 설명: 본체는 PagedCard를 직접 사용하므로 동일한 그리드 배치 클래스를 상수로 공유한다
 *              (기존 평점입력현황 + 경기별참여율 두 칸을 합쳐 하단 전체 폭 한 칸으로 배치)
 */
import { Card } from "@youngduck/yd-ui/Cards";

/** 대시보드 그리드 배치 클래스 (본체 PagedCard / 스켈레톤 / 에러 공통) */
export const MATCH_OVERVIEW_CARD_CLASS =
  "text-primary-100 h-full w-full md:col-start-1 md:col-end-7 md:row-start-4 md:row-end-7";

const AdminDashboardMatchOverviewWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card variant="outlined" className={`${MATCH_OVERVIEW_CARD_CLASS} flex flex-col justify-center`}>
      {children}
    </Card>
  );
};

export default AdminDashboardMatchOverviewWrapper;
