/**
 * 작성자: KYD
 * 기능: 마이페이지 - 사용자 정보 및 주요 기능 제공
 * 프로세스 설명: 프로필 섹션(아바타/닉네임/포인트), 빠른 링크로 구성
 */
import AuthInfoProfileCard from "./auth-info-profile-card/auth-info-profile-card";
import AuthInfoProfileCardErrorFallback from "./auth-info-profile-card/error/auth-info-profile-card-error-fallback";
import AuthInfoProfileCardSkeleton from "./auth-info-profile-card/skeleton/auth-info-profile-card-skeleton";
import AuthInfoQuickLinks from "./auth-info-quick-links/auth-info-quick-links";

import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";
import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

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
        <div className="flex w-full flex-col gap-6">
          <h1 className="text-yds-s2 text-primary-100 mt-4">내 정보</h1>
          {/* 프로필 섹션 */}
          <ReactQueryBoundary
            skeleton={<AuthInfoProfileCardSkeleton />}
            errorFallback={AuthInfoProfileCardErrorFallback}
          >
            <AuthInfoProfileCard />
          </ReactQueryBoundary>
          {/* 빠른 링크 섹션 */}
          <AuthInfoQuickLinks />
        </div>
      </LayoutWithHeaderFooter>
      <BottomNavigationBar />
    </div>
  );
};

export default AuthInformationPage;
