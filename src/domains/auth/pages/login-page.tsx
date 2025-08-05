/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */

import KakaoLoginButton from "@auth/components/kakao-login-button";
import AnonymousLoginButton from "@auth/components/anonymous-login-button";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";
import PlayerRatingRotator from "@shared/components/player-rating-rotator";

const SIGNAL_IDUNA_PARK_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund//iduna_park.png`;

const LoginPage = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-5">
      <PlayerRatingRotator />
      <img src={SIGNAL_IDUNA_PARK_IMAGE} alt="Dortmund Logo" className="h-auto w-full" />
      <h1 className="text-primary-400 font-shilla-culture text-center text-4xl font-bold">보돌코 스코어드</h1>
      <div className="flex w-full flex-col gap-4">
        <KakaoLoginButton />
        <AnonymousLoginButton />
      </div>
      <p className="text-primary-100 mt-4 text-center text-xs">
        ※ 도르트문트 팬을 위해 비영리적 목적으로 제작되었으며,
        <br />
        저작권 문제 발생 시 어플리케이션이 삭제될 수 있습니다.
      </p>
    </div>
  );
};

export default LoginPage;
