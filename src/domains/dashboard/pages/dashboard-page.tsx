import MatchesHistoryErrorFallback from "@matches/matches-history/components/error/matches-history-error-fallback";
import MatchesHistory from "@matches/matches-history/components/matches-history";
import MatchesHistorySkeleton from "@matches/matches-history/components/skeleton/matches-history-skeleton";
import MatchesLastestErrorFallback from "@matches/matches-lastest/components/error/matches-lastest-error-fallback";
import MatchesLastest from "@matches/matches-lastest/components/matches-lastest";
import MatchesLastestSkeleton from "@matches/matches-lastest/components/skeleton/matches-lastest-skeleton";

import PlayerDbErrorFallback from "@players/players-db/components/error/players-db-error-fallback";
import PlayerDb from "@players/players-db/components/players-db";
import PlayerDbSkeleton from "@players/players-db/components/skeleton/players-db-skeleton";

import LogoutButton from "@shared/components/layout/header/buttons/logout-button";
import Header from "@shared/components/layout/header/header";
import CustomHelmet from "@shared/components/seo/custom-helmet";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import LayoutWithHeader from "@shared/provider/layout-with-header";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const options = {
  leftIcon: <LogoutButton />,
};
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const DashboardPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <>
      <CustomHelmet
        title="보돌코스코어드 실시간 평점"
        description="지금 바로 평점 확인하기"
        keywords="보돌코스코어드, 대시보드, 경기결과, 선수평점, 팬사이트, 최신경기, 평점시스템"
        url="https://bdks.vercel.app/dashboard"
        type="website"
      />
      <div className="bdks-container" ref={pageRef}>
        <Header options={options} />
        <LayoutWithHeader>
          <ReactQueryBoundary skeleton={<MatchesLastestSkeleton />} errorFallback={MatchesLastestErrorFallback}>
            <MatchesLastest />
          </ReactQueryBoundary>
          <ReactQueryBoundary skeleton={<MatchesHistorySkeleton />} errorFallback={MatchesHistoryErrorFallback}>
            <MatchesHistory />
          </ReactQueryBoundary>
          <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
            <PlayerDb />
          </ReactQueryBoundary>
        </LayoutWithHeader>
      </div>
    </>
  );
};

export default DashboardPage;
