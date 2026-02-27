/**
 * 작성자: KYD
 * 기능: 출석체크 페이지
 * 프로세스 설명: 내 정보 > 바로가기 출석 버튼 진입 페이지
 */
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import BottomNavigationBar from "@shared/components/layout/footer/bottom-navigation-bar";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import AttendanceCheck from "@auth/auth-info/auth-info-quick-links/attendance-check/components/attendance-check";
import AttendanceCheckErrorFallback from "@auth/auth-info/auth-info-quick-links/attendance-check/components/error/attendance-check-error-fallback";
import AttendanceCheckSkeleton from "@auth/auth-info/auth-info-quick-links/attendance-check/components/skeleton/attendance-check-skeleton";

const options = {
  leftIcon: <BackButton />,
};

const AttendanceCheckPage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <LayoutWithHeaderFooter>
        <ReactQueryBoundary skeleton={<AttendanceCheckSkeleton />} errorFallback={AttendanceCheckErrorFallback}>
          <AttendanceCheck />
        </ReactQueryBoundary>
      </LayoutWithHeaderFooter>
      <BottomNavigationBar />
    </div>
  );
};

export default AttendanceCheckPage;
