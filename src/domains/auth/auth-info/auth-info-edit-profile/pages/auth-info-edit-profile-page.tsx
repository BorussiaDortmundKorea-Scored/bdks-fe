/**
 * 작성자: KYD
 * 기능: 프로필 수정 페이지
 */
import AuthInfoEditProfile from "@auth/auth-info/auth-info-edit-profile/auth-info-edit-profile";

import { BackButton } from "@shared/components/layout/header/buttons";
import Header from "@shared/components/layout/header/header";
import { usePageTransition } from "@shared/hooks/use-page-transition";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const options = {
  leftIcon: <BackButton />,
};

const AuthInfoEditProfilePage = () => {
  const { pageRef } = usePageTransition();

  return (
    <div className="bdks-container" ref={pageRef}>
      <Header options={options} />
      <ReactQueryBoundary
        skeleton={<div className="flex h-40 w-full items-center justify-center text-primary-100">불러오는 중...</div>}
        errorFallback={() => (
          <div className="flex h-40 w-full items-center justify-center text-primary-100">
            프로필 정보를 불러올 수 없습니다.
          </div>
        )}
      >
        <AuthInfoEditProfile />
      </ReactQueryBoundary>
    </div>
  );
};

export default AuthInfoEditProfilePage;
