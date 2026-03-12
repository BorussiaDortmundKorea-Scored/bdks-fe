/**
 * 작성자: KYD
 * 기능: 관람체크 페이지
 * 프로세스 설명: 내 정보 > 바로가기 관람 버튼 진입 페이지
 */
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import ViewingCheck from "@auth/auth-info/auth-info-quick-links/viewing-check/components/viewing-check";
import ViewingCheckErrorFallback from "@auth/auth-info/auth-info-quick-links/viewing-check/components/error/viewing-check-error-fallback";
import ViewingCheckSkeleton from "@auth/auth-info/auth-info-quick-links/viewing-check/components/skeleton/viewing-check-skeleton";

const options = {
  leftIcon: <BackButton />,
};

const ViewingCheckPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <LayoutWithHeaderFooter>
        <ReactQueryBoundary skeleton={<ViewingCheckSkeleton />} errorFallback={ViewingCheckErrorFallback}>
          <ViewingCheck />
        </ReactQueryBoundary>
      </LayoutWithHeaderFooter>
      <BottomNavigationBar />
    </div>
  );
};

export default ViewingCheckPage;
