/**
 * 작성자: KYD
 * 기능: 페이지 청크(lazy) 로딩 시 노출되는 전체 화면 로딩 컴포넌트
 * 프로세스 설명: Router의 Suspense fallback으로 사용, 다크+골드 브랜드 톤 유지
 */

const PageLoading = () => {
  //SECTION HOOK호출 영역
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역
  //!SECTION 상태값 영역

  //SECTION 메서드 영역
  //!SECTION 메서드 영역

  return (
    <div
      data-testid="page-loading"
      className="bg-background-primary flex h-dvh w-full flex-col items-center justify-center gap-6"
    >
      <div className="border-yellow-500/20 border-t-yellow-500 size-12 animate-spin rounded-full border-4" />

      <div className="flex flex-col items-center gap-1">
        <p className="font-shilla-culture text-2xl font-bold text-primary-400">보돌코 스코어드</p>
        <p className="text-sm text-primary-100">불러오는 중...</p>
      </div>
    </div>
  );
};

export default PageLoading;
