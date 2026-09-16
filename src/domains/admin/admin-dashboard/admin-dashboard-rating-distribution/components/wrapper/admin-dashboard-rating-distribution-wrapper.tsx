/**
 * 작성자: KYD
 * 기능: 평점 분포 카드 공통 레이아웃 쉘(스켈레톤/에러용) + 그리드 배치 클래스 공유
 * 프로세스 설명: 본체는 PagedCard를 직접 쓰므로 배치 클래스만 상수로 공유한다 (match-overview와 동일한 방식)
 */
import { Card } from "@youngduck/yd-ui/Cards";

/** 카드 제목 (본체 PagedCard.Header / 스켈레톤 / 에러 공통) */
export const RATING_DISTRIBUTION_TITLE = "평점 분포";

/** 대시보드 그리드 배치 클래스 (본체 PagedCard / 스켈레톤 / 에러 공통) */
export const RATING_DISTRIBUTION_CARD_CLASS =
  "text-primary-100 h-full w-full md:col-start-5 md:col-end-9 md:row-start-7 md:row-end-9";

const AdminDashboardRatingDistributionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card variant="outlined" className={`${RATING_DISTRIBUTION_CARD_CLASS} flex flex-col justify-center`}>
      {/* 제목은 정적이라 로딩 중에도 진짜 문구를 보여준다 (회원 리텐션 카드와 같은 방식) */}
      <span className="text-yds-s2 text-primary-100 mb-2">{RATING_DISTRIBUTION_TITLE}</span>
      {children}
    </Card>
  );
};

export default AdminDashboardRatingDistributionWrapper;
