import DashboardSidePanel from "@dashboard/components/dashboard-side-panel";

import MatchesHistoryErrorFallback from "@matches/matches-history/components/error/matches-history-error-fallback";
import MatchesHistory from "@matches/matches-history/components/matches-history";
import MatchesHistorySkeleton from "@matches/matches-history/components/skeleton/matches-history-skeleton";
import MatchesLastestErrorFallback from "@matches/matches-lastest/components/error/matches-lastest-error-fallback";
import MatchesLastest from "@matches/matches-lastest/components/matches-lastest";
import MatchesLastestSkeleton from "@matches/matches-lastest/components/skeleton/matches-lastest-skeleton";

import PlayerDbErrorFallback from "@players/players-db/components/error/players-db-error-fallback";
import PlayerDb from "@players/players-db/components/players-db";
import PlayerDbSkeleton from "@players/players-db/components/skeleton/players-db-skeleton";

import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";
import { MenuButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import CustomHelmet from "@shared/components/seo/custom-helmet";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const options = {
  leftIcon: <MenuButton />,
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
      <div className="bdks-container-wide" ref={pageRef}>
        <Header options={options} />
        <LayoutWithHeaderFooter>
          {/*
            2단 레이아웃(실험):
            - 좁은 화면(<1024px): 1열, 좌측 콘텐츠를 기존과 동일하게 450px로 센터 유지
            - 넓은 화면(≥1024px): 2열 [좌 450px 고정 / 우 나머지], 우측에 카드열
          */}
          <div className="mx-auto grid w-full max-w-[450px] grid-cols-1 gap-4 min-[1024px]:max-w-none min-[1024px]:grid-cols-[450px_minmax(0,1fr)]">
            <div className="flex w-full flex-col gap-4">
              <ReactQueryBoundary skeleton={<MatchesLastestSkeleton />} errorFallback={MatchesLastestErrorFallback}>
                <MatchesLastest />
              </ReactQueryBoundary>
              <ReactQueryBoundary skeleton={<MatchesHistorySkeleton />} errorFallback={MatchesHistoryErrorFallback}>
                <MatchesHistory />
              </ReactQueryBoundary>
              <ReactQueryBoundary skeleton={<PlayerDbSkeleton />} errorFallback={PlayerDbErrorFallback}>
                <PlayerDb />
              </ReactQueryBoundary>
            </div>
            <DashboardSidePanel />
          </div>
        </LayoutWithHeaderFooter>
        <BottomNavigationBar />
      </div>
    </>
  );
};

export default DashboardPage;
