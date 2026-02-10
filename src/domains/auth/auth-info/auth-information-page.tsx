/**
 * 작성자: KYD
 * 기능: 마이페이지 - 사용자 정보 및 주요 기능 제공
 * 프로세스 설명: 사용자 인사말, 메인 카드(프로필/예약/설정/결제), 빠른 링크, 프로모션 배너로 구성
 */
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import AuthInfoProfileCard from "./auth-info-profile-card/auth-info-profile-card";
import AuthInfoPointCard from "./auth-info-point-card/auth-info-point-card";
import AuthInfoPointCardErrorFallback from "./auth-info-point-card/error/auth-info-point-card-error-fallback";
import AuthInfoPointCardSkeleton from "./auth-info-point-card/skeleton/auth-info-point-card-skeleton";
import AuthInfoTierMakerCard from "./auth-info-tier-maker-card/auth-info-tier-maker-card";
import AuthInfoMatchPredictionCard from "./auth-info-match-prediction-card/auth-info-match-prediction-card";
import AuthInfoGreeting from "./auth-info-greeting/auth-info-greeting";
import AuthInfoQuickLinks from "./auth-info-quick-links/auth-info-quick-links";

import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const options = {
  leftIcon: <BackButton />,
};
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const AuthInformationPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <LayoutWithHeaderFooter>
        <div className="flex w-full flex-col gap-4">
          {/* 인사말 섹션 */}
          <AuthInfoGreeting />
          {/* 메인 카드 섹션 */}
          <div>
            <div className="grid h-[280px] w-full grid-cols-5 grid-rows-7 gap-4">
              <AuthInfoProfileCard />
              <ReactQueryBoundary
                skeleton={<AuthInfoPointCardSkeleton />}
                errorFallback={AuthInfoPointCardErrorFallback}
              >
                <AuthInfoPointCard />
              </ReactQueryBoundary>
              <AuthInfoTierMakerCard />
              <AuthInfoMatchPredictionCard />
            </div>
          </div>
          {/* 빠른 링크 섹션 */}
          <AuthInfoQuickLinks />
        </div>
      </LayoutWithHeaderFooter>
      <BottomNavigationBar />
    </div>
  );
};

export default AuthInformationPage;
