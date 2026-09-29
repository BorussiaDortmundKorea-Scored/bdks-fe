/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 카드 공통 레이아웃 쉘 (스켈레톤/에러용) + 그리드 배치 클래스 공유
 * 프로세스 설명: 본체는 PagedCard를 직접 사용하므로 동일한 그리드 배치 클래스를 상수로 공유한다
 */
import { Card } from "@youngduck/yd-ui/Cards";

/** 카드 제목 (본체 PagedCard.Header / 스켈레톤 / 에러 공통) */
export const RATING_TREND_TITLE = "평점 활동 추이";

/** 대시보드 그리드 배치 클래스 (본체 PagedCard / 스켈레톤 / 에러 공통) */
export const RATING_TREND_CARD_CLASS =
  "text-primary-100 h-full w-full xl:col-start-4 xl:col-end-9 xl:row-start-2 xl:row-end-4";

const AdminDashboardRatingTrendWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card variant="outlined" className={`${RATING_TREND_CARD_CLASS} flex flex-col justify-center`}>
      {/* 제목은 정적이라 로딩 중에도 진짜 문구를 보여준다 (회원 리텐션 카드와 같은 방식) */}
      <span className="text-yds-s2 text-primary-100 mb-2">{RATING_TREND_TITLE}</span>
      {children}
    </Card>
  );
};

export default AdminDashboardRatingTrendWrapper;
