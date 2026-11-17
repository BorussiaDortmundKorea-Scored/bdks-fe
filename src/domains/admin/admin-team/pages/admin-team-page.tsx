/**
 * 작성자: KYD
 * 기능: 관리자 팀 관리 페이지
 * 프로세스 설명: 대시보드처럼 1~2행에 팀 현황 요약·국가별 팀 수 카드를, 3행부터 팀 목록 표를 배치한다.
 *              위젯은 자기 위치를 모르고 칸을 채우기만 하므로, 배치는 이 파일의 AREA 만 고치면 된다.
 */
import AdminTeamCountryCount from "@admin/admin-team/admin-team-country-count/components/admin-team-country-count";
import AdminTeamCountryCountErrorFallback from "@admin/admin-team/admin-team-country-count/components/error/admin-team-country-count-error-fallback";
import AdminTeamCountryCountSkeleton from "@admin/admin-team/admin-team-country-count/components/skeleton/admin-team-country-count-skeleton";
import AdminTeamSummary from "@admin/admin-team/admin-team-summary/components/admin-team-summary";
import AdminTeamSummaryErrorFallback from "@admin/admin-team/admin-team-summary/components/error/admin-team-summary-error-fallback";
import AdminTeamSummarySkeleton from "@admin/admin-team/admin-team-summary/components/skeleton/admin-team-summary-skeleton";
import AdminTeam from "@admin/admin-team/components/admin-team";
import AdminTeamErrorFallback from "@admin/admin-team/components/error/admin-team-error-fallback";
import AdminTeamSkeleton from "@admin/admin-team/components/skeleton/admin-team-skeleton";
import AdminGridWrapper from "@admin/provider/admin-grid-wrapper";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

/**
 *   행\열  1   2   3   4   5   6   7   8
 *   1-2   [팀 현황    ][국가별 팀 수              ]
 *   3-8   [팀 목록                               ]
 */
const CELL = "h-full min-h-0 min-w-0 w-full";
const AREA = {
  summary: `${CELL} xl:col-start-1 xl:col-end-4 xl:row-start-1 xl:row-end-3`,
  countryCount: `${CELL} xl:col-start-4 xl:col-end-9 xl:row-start-1 xl:row-end-3`,
  teamList: `${CELL} xl:col-start-1 xl:col-end-9 xl:row-start-3 xl:row-end-9`,
};

const AdminTeamPage = () => {
  return (
    <AdminGridWrapper>
      <div className={AREA.summary}>
        <ReactQueryBoundary skeleton={<AdminTeamSummarySkeleton />} errorFallback={AdminTeamSummaryErrorFallback}>
          <AdminTeamSummary />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.countryCount}>
        <ReactQueryBoundary
          skeleton={<AdminTeamCountryCountSkeleton />}
          errorFallback={AdminTeamCountryCountErrorFallback}
        >
          <AdminTeamCountryCount />
        </ReactQueryBoundary>
      </div>
      <div className={AREA.teamList}>
        <ReactQueryBoundary skeleton={<AdminTeamSkeleton />} errorFallback={AdminTeamErrorFallback}>
          <AdminTeam />
        </ReactQueryBoundary>
      </div>
    </AdminGridWrapper>
  );
};

export default AdminTeamPage;
