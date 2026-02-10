/**
 * 포인트 카드 에러 폴백
 */
const AuthInfoPointCardErrorFallback = () => {
  return (
    <div
      className="bg-background-tertiary card-navy-50 col-span-2 row-span-4 flex h-full w-full flex-col items-center justify-center rounded-lg p-4 text-yds-c1m text-primary-100"
      data-testid="auth-info-point-card-error"
    >
      포인트를 불러올 수 없습니다.
    </div>
  );
};

export default AuthInfoPointCardErrorFallback;
