/**
 * 작성자: KYD
 * 기능: 리그 순위 에러 폴백
 */
const AdminStandingsErrorFallback = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-between p-4">
        <h2 className="text-yds-s1 text-primary-100">리그 순위</h2>
      </div>
      <div
        data-testid="admin-standings-error"
        className="yds-card yds-card-outlined text-primary-100 flex w-full flex-col items-center justify-center gap-1 p-4"
      >
        <p className="text-yds-c1m text-red-500">순위를 불러올 수 없습니다</p>
        <p className="text-yds-c2r">잠시 후 다시 시도해주세요</p>
      </div>
    </div>
  );
};

export default AdminStandingsErrorFallback;
