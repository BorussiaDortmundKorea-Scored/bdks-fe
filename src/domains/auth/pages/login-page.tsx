/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import AnonymousLoginButton from "@auth/components/anonymous-login-button";
import KakaoLoginButton from "@auth/components/kakao-login-button";

import PlayerRatingRotatorErrorFallback from "@players/players-rating-rotator/components/error/players-rating-rotator-error-fallback";
import PlayerRatingRotator from "@players/players-rating-rotator/components/players-rating-rotator";
import PlayerRatingRotatorSkeleton from "@players/players-rating-rotator/components/skeleton/players-rating-rotator-skeleton";

import ImageWithSkeleton from "@shared/components/image/image-with-skeleton";
import CustomHelmet from "@shared/components/seo/custom-helmet";
import { SUPABASE_STORAGE_URL } from "@shared/constants/supabse-storage";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
const SIGNAL_IDUNA_PARK_IMAGE = `${SUPABASE_STORAGE_URL}/dortmund//iduna_park.png`;
//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const LoginPage = () => {
  //SECTION HOOK호출 영역
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <>
      <CustomHelmet
        title="보돌코 스코어드"
        description="보루시아 도르트문트 팬을 위한 평점 입력 사이트"
        keywords="도르트문트, 보루시아 도르트문트, 보돌코, 보돌코스코어드"
        url="https://bdks.vercel.app/"
        type="website"
      />

      <div className="bdks-container justify-center gap-5">
        <ReactQueryBoundary skeleton={<PlayerRatingRotatorSkeleton />} errorFallback={PlayerRatingRotatorErrorFallback}>
          <PlayerRatingRotator />
        </ReactQueryBoundary>
        <ImageWithSkeleton src={SIGNAL_IDUNA_PARK_IMAGE} skeleton={<SkeletonComponent />}>
          {({ src }) => <img src={src} alt="Dortmund Logo" className="aspect-[3/2] w-full" />}
        </ImageWithSkeleton>
        <h1 className="text-primary-400 font-shilla-culture text-center text-4xl font-bold">보돌코 스코어드</h1>
        <div className="flex w-full flex-col gap-4">
          <KakaoLoginButton />
          <AnonymousLoginButton />
        </div>
        <p className="text-primary-100 mt-4 text-center text-xs">
          ※ 도르트문트 팬을 위해 비영리적 목적으로 제작되었으며,
          <br />
          모든 저작권은 도르트문트 | 분데스리가에 있습니다.
        </p>
      </div>
    </>
  );
};

export default LoginPage;

const SkeletonComponent = () => {
  return (
    <div className="flex aspect-[3/2] w-full items-center justify-center text-lg text-white">경기장 가져오는중...</div>
  );
};
