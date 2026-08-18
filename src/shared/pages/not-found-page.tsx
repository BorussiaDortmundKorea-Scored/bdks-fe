/**
 * 작성자: KYD
 * 기능: 존재하지 않는 경로 접근 시 노출되는 404 페이지
 * 프로세스 설명: 에러 코드 대신 로고를 노출, 다크+골드 브랜드 톤 유지, yd-ui Button으로 홈/이전 이동 제공
 */
import { Button } from "@youngduck/yd-ui";

import { ROUTES } from "@shared/constants/routes";
import { LOGO_IMAGE } from "@shared/constants/supabse-storage";

const NotFoundPage = () => {
  //SECTION HOOK호출 영역
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  const handleGoHome = () => {
    window.location.href = ROUTES.DASHBOARD;
  };

  const handleGoBack = () => {
    window.history.back();
  };
  //!SECTION 메서드 영역

  return (
    <div
      data-testid="not-found-page"
      className="bg-background-primary flex h-dvh w-full flex-col items-center justify-center px-6 text-center"
    >
      <img src={LOGO_IMAGE} alt="보돌코 스코어드 로고" className="w-28" />
      <h1 className="text-primary-400 mt-6 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="text-primary-100 mt-3 text-sm">
        요청하신 페이지가 존재하지 않거나
        <br />
        이동되었을 수 있습니다.
      </p>

      <div className="mt-10 flex w-full max-w-[280px] flex-col gap-3">
        <Button size="full" variant="fill" color="primary" onClick={handleGoHome}>
          홈으로 돌아가기
        </Button>
        <Button size="full" variant="outlined" color="primary" onClick={handleGoBack}>
          이전 페이지
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
