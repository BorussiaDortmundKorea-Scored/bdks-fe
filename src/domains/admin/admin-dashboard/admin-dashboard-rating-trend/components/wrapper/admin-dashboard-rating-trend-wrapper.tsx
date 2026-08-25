/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 카드 공통 레이아웃 쉘 (스켈레톤/에러용) + 그리드 배치 클래스 공유
 * 프로세스 설명: 본체는 PagedCard를 직접 사용하므로 동일한 그리드 배치 클래스를 상수로 공유한다
 */
import { Card } from "@youngduck/yd-ui/Cards";

/** 대시보드 그리드 배치 클래스 (본체 PagedCard / 스켈레톤 / 에러 공통) */
export const RATING_TREND_CARD_CLASS =
  "text-primary-100 h-full w-full md:col-start-4 md:col-end-9 md:row-start-2 md:row-end-4";

const AdminDashboardRatingTrendWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card variant="outlined" className={`${RATING_TREND_CARD_CLASS} flex flex-col justify-center`}>
      {children}
    </Card>
  );
};

export default AdminDashboardRatingTrendWrapper;
