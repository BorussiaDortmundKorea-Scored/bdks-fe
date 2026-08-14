/**
 * 작성자: KYD
 * 기능: 선수 이적시장 페이지
 * 프로세스 설명: 내 정보 > 바로가기 > 선수 이적시장 진입 페이지
 */
import TransferMarket from "@auth/auth-info/auth-info-quick-links/transfer-market/components/transfer-market";
import TransferMarketErrorFallback from "@auth/auth-info/auth-info-quick-links/transfer-market/components/error/transfer-market-error-fallback";
import TransferMarketSkeleton from "@auth/auth-info/auth-info-quick-links/transfer-market/components/skeleton/transfer-market-skeleton";

import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";
import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const options = {
  leftIcon: <BackButton />,
};

const TransferMarketPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <LayoutWithHeaderFooter>
        <ReactQueryBoundary skeleton={<TransferMarketSkeleton />} errorFallback={TransferMarketErrorFallback}>
          <TransferMarket />
        </ReactQueryBoundary>
      </LayoutWithHeaderFooter>
      <BottomNavigationBar />
    </div>
  );
};

export default TransferMarketPage;
