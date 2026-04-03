/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import AuthProfile from "@auth-profile/components/auth-profile";

import LogoutButton from "@shared/components/layout/header/buttons/logout-button";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const options = {
  leftIcon: <LogoutButton />,
};
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const AuthProfilePage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <ReactQueryBoundary
        skeleton={<div className="flex h-40 w-full items-center justify-center text-primary-100">불러오는 중...</div>}
        errorFallback={() => (
          <div className="flex h-40 w-full items-center justify-center text-primary-100">
            선수 정보를 불러올 수 없습니다.
          </div>
        )}
      >
        <AuthProfile />
      </ReactQueryBoundary>
    </div>
  );
};

export default AuthProfilePage;
