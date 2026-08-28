/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 PagedCard (참여율 / 입력 현황을 dot 페이저로 전환)
 * 프로세스 설명: get_match_overview 한 번 조회 → 참여율(Line) / 입력 현황(Bar+드릴다운) 두 페이지로 렌더.
 *              두 페이지가 같은 경기 집합/정렬을 공유한다.
 */
import { useState } from "react";

import { useGetMatchOverview } from "../api/react-query-api/use-get-match-overview";
import { MATCH_OVERVIEW_CARD_CLASS } from "./wrapper/admin-dashboard-match-overview-wrapper";
import { PagedCard } from "@youngduck/yd-ui/Cards";

import { type IMatchCoverageItem } from "@admin/admin-dashboard/admin-dashboard-match-coverage/api/admin-dashboard-match-coverage-api";
import AdminDashboardMatchCoverageChart from "@admin/admin-dashboard/admin-dashboard-match-coverage/components/admin-dashboard-match-coverage-chart";
import { type IMatchStatsData } from "@admin/admin-dashboard/admin-dashboard-match-stats/api/admin-dashboard-match-stats-api";
import AdminDashboardMatchStatsView from "@admin/admin-dashboard/admin-dashboard-match-stats/components/admin-dashboard-match-stats-view";

// 페이지별 서브타이틀 (헤더 하단, 현재 페이지에 따라 변경)
const PAGE_SUBTITLES = ["참여율", "개수"] as const;

const AdminDashboardMatchOverview = () => {
  //SECTION HOOK호출 영역
  const overview = useGetMatchOverview();
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역 (PagedCard 제어 모드: 현재 페이지 추적 → 서브타이틀 반영)
  const [page, setPage] = useState(0);
  //!SECTION 상태값 영역

  //SECTION 상태값 영역
  // 두 페이지 정렬 통일: 날짜 오름차순(과거→최신, coverage/rating-trend와 동일)
  const ordered = [...overview].sort((a, b) => a.match_date.localeCompare(b.match_date));

  // 참여율(Line) 페이지용 매핑: participant_count = unique_user_count
  const coverageData: IMatchCoverageItem[] = ordered.map((item) => ({
    match_id: item.match_id,
    opponent_name: item.opponent_name,
    match_date: item.match_date,
    participant_count: item.unique_user_count,
    total_users: item.total_users,
    coverage_percent: item.coverage_percent,
  }));

  // 입력 현황(Bar) 페이지용 매핑 (season/competition_name 은 차트 미사용)
  const statsData: IMatchStatsData[] = ordered.map((item) => ({
    match_id: item.match_id,
    match_name: item.match_name,
    season: "",
    competition_name: "",
    opponent_name: item.opponent_name,
    match_date: item.match_date,
    unique_user_count: item.unique_user_count,
    total_rating_count: item.total_rating_count,
  }));
  //!SECTION 상태값 영역

  return (
    <PagedCard variant="outlined" className={MATCH_OVERVIEW_CARD_CLASS} page={page} onPageChange={setPage}>
      <PagedCard.Header>
        <div className="flex min-w-0 flex-col">
          <span className="truncate">경기별 평점</span>
          <span className="text-yds-c1m text-primary-100">{PAGE_SUBTITLES[page]}</span>
        </div>
      </PagedCard.Header>
      <PagedCard.Page className="flex h-full flex-col">
        {coverageData.length === 0 ? (
          <p className="text-yds-c1m text-primary-100">평점 데이터가 있는 경기가 없습니다.</p>
        ) : (
          <div className="min-h-0 flex-1">
            <AdminDashboardMatchCoverageChart data={coverageData} />
          </div>
        )}
      </PagedCard.Page>
      <PagedCard.Page className="h-full">
        <AdminDashboardMatchStatsView data={statsData} />
      </PagedCard.Page>
    </PagedCard>
  );
};

export default AdminDashboardMatchOverview;
