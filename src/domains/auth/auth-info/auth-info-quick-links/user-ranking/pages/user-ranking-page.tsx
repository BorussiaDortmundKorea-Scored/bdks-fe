/**
 * 작성자: KYD
 * 기능: 유저 랭킹 페이지
 * 프로세스 설명: 내 정보 > 바로가기 유저 랭킹 버튼 진입 페이지
 */
import UserRanking from "@auth/auth-info/auth-info-quick-links/user-ranking/components/user-ranking";
import UserRankingErrorFallback from "@auth/auth-info/auth-info-quick-links/user-ranking/components/error/user-ranking-error-fallback";
import UserRankingSkeleton from "@auth/auth-info/auth-info-quick-links/user-ranking/components/skeleton/user-ranking-skeleton";

import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";
import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const options = {
  leftIcon: <BackButton />,
};

const UserRankingPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <LayoutWithHeaderFooter>
        <ReactQueryBoundary skeleton={<UserRankingSkeleton />} errorFallback={UserRankingErrorFallback}>
          <UserRanking />
        </ReactQueryBoundary>
      </LayoutWithHeaderFooter>
      <BottomNavigationBar />
    </div>
  );
};

export default UserRankingPage;
