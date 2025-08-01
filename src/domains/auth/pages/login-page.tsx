/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */

import KakaoLoginButton from "@auth/components/KakaoLoginButton";
import AnonymousLoginButton from "@auth/components/AnonymousLoginButton";

const LoginPage = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg p-8 shadow-md">
        <h1 className="mb-8 text-center font-[shilla-culture] text-2xl">로그인</h1>

        <div className="flex flex-col gap-1">
          <KakaoLoginButton />
          <AnonymousLoginButton />
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">익명으로 이용 시 일부 기능이 제한될 수 있습니다.</p>
      </div>
    </div>
  );
};

export default LoginPage;
