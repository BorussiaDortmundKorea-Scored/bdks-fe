/**
 * 작성자: KYD
 * 기능: 평점 분포 PagedCard (경기 시간별 / 점수대 분포를 dot 페이저로 전환)
 * 프로세스 설명: get_rating_stats 한 번 조회 → 경기 시간별 막대 / 점수대 히스토그램 두 페이지로 렌더한다.
 */
import { PagedCard } from "@youngduck/yd-ui/Cards";

import { useGetRatingStats } from "@admin/admin-dashboard/admin-dashboard-rating-distribution/api/react-query-api/use-get-rating-stats";
import AdminDashboardRatingDistributionChart from "@admin/admin-dashboard/admin-dashboard-rating-distribution/components/admin-dashboard-rating-distribution-chart";
import AdminDashboardRatingPhaseChart from "@admin/admin-dashboard/admin-dashboard-rating-distribution/components/admin-dashboard-rating-phase-chart";
import {
  RATING_DISTRIBUTION_CARD_CLASS,
  RATING_DISTRIBUTION_TITLE,
} from "@admin/admin-dashboard/admin-dashboard-rating-distribution/components/wrapper/admin-dashboard-rating-distribution-wrapper";

/**
 * 차트 높이를 픽셀로 고정한다.
 *
 * 대시보드 그리드는 `xl:grid-rows-8` + 좌측 nav 의 `min-h-[876px]` 로 1행이 약 91.5px 이고,
 * 이 카드는 2행(row 7~9)이라 카드 전체가 약 199px 다. 높이를 안 주면 Chart.js 가 기본 종횡비로
 * 220px 쯤을 잡아 카드가 2행을 넘고, `minmax(0,1fr)` 행들이 그 높이에 맞춰 전부 늘어난다
 * (= 대시보드 전체 행 높이가 길어진다). 그래서 flex-1 대신 고정 높이를 쓴다.
 */
const CHART_BOX_CLASS = "h-[104px] w-full shrink-0";

const AdminDashboardRatingDistribution = () => {
  //SECTION HOOK호출 영역
  const stats = useGetRatingStats();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const hasRatings = stats.total_rating_count > 0;
  //!SECTION 상태값 영역

  return (
    <PagedCard variant="outlined" className={RATING_DISTRIBUTION_CARD_CLASS}>
      <PagedCard.Header>{RATING_DISTRIBUTION_TITLE}</PagedCard.Header>
      <PagedCard.Page className="flex h-full flex-col gap-1">
        <span className="text-yds-c1m text-primary-100">경기 시간별</span>
        {hasRatings ? (
          <div className={CHART_BOX_CLASS}>
            <AdminDashboardRatingPhaseChart data={stats.phase} />
          </div>
        ) : (
          <p className="text-yds-c1m text-primary-100">입력된 평점이 없습니다.</p>
        )}
      </PagedCard.Page>
      <PagedCard.Page className="flex h-full flex-col gap-1">
        <span className="text-yds-c1m text-primary-100">
          점수대별 · 평균 {Number(stats.average_rating).toFixed(2)}점 / 총 {stats.total_rating_count.toLocaleString()}건
        </span>
        {hasRatings ? (
          <div className={CHART_BOX_CLASS}>
            <AdminDashboardRatingDistributionChart data={stats.distribution} />
          </div>
        ) : (
          <p className="text-yds-c1m text-primary-100">입력된 평점이 없습니다.</p>
        )}
      </PagedCard.Page>
    </PagedCard>
  );
};

export default AdminDashboardRatingDistribution;
