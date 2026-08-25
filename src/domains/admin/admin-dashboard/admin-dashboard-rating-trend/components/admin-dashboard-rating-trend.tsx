/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 PagedCard (월별 평점 입력량 / 경기별 평점 참여를 dot 페이저로 전환)
 * 프로세스 설명: get_monthly_rating_trend / get_match_participation_trend RPC를 조회해 스파크라인 페이지 2개로 표시
 */
import { PagedCard } from "@youngduck/yd-ui/Cards";

import { useGetMatchParticipationTrendSuspense } from "../api/react-query-api/use-get-match-participation-trend";
import { useGetMonthlyRatingTrendSuspense } from "../api/react-query-api/use-get-monthly-rating-trend";
import StatSparklineCard from "./stat-sparkline-card";
import { RATING_TREND_CARD_CLASS } from "./wrapper/admin-dashboard-rating-trend-wrapper";

const AdminDashboardRatingTrend = () => {
  //SECTION HOOK호출 영역
  const { data: monthly } = useGetMonthlyRatingTrendSuspense();
  const { data: matchTrend } = useGetMatchParticipationTrendSuspense();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  const monthlySeries = monthly.map((month) => month.rating_count);
  const monthlyLabels = monthly.map((month) => month.bucket_month.slice(0, 7)); // YYYY-MM
  const monthlyCurrent = monthlySeries[monthlySeries.length - 1] ?? 0;
  const monthlyPrevious = monthlySeries[monthlySeries.length - 2] ?? 0;

  const matchSeries = matchTrend.map((match) => match.unique_user_count);
  const matchLabels = matchTrend.map((match) => `${match.match_date} ${match.opponent_name}`);
  const matchCurrent = matchSeries[matchSeries.length - 1] ?? 0;
  const matchPrevious = matchSeries[matchSeries.length - 2] ?? 0;
  const latestOpponent = matchTrend[matchTrend.length - 1]?.opponent_name;
  //!SECTION 상태값 영역

  return (
    <PagedCard variant="outlined" className={RATING_TREND_CARD_CLASS}>
      <PagedCard.Header>평점 활동 추이</PagedCard.Header>
      <PagedCard.Page>
        <StatSparklineCard
          label="이번 달"
          current={monthlyCurrent}
          previous={monthlyPrevious}
          unit="개"
          series={monthlySeries}
          tooltipLabels={monthlyLabels}
          caption="최근 12개월"
        />
      </PagedCard.Page>
      <PagedCard.Page>
        <StatSparklineCard
          label="최근 경기"
          current={matchCurrent}
          previous={matchPrevious}
          unit="명"
          series={matchSeries}
          tooltipLabels={matchLabels}
          caption={latestOpponent ? `vs ${latestOpponent}` : undefined}
        />
      </PagedCard.Page>
    </PagedCard>
  );
};

export default AdminDashboardRatingTrend;
