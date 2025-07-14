/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */

import KakaoLoginButton from "../../components/KakaoLoginButton";
import AnonymousLoginButton from "../../components/AnonymousLoginButton";

const LoginPage = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

        <div className="space-y-4">
          <KakaoLoginButton />
          <AnonymousLoginButton />
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">익명으로 이용 시 일부 기능이 제한될 수 있습니다.</p>
      </div>
    </div>
  );
};

export default LoginPage;
