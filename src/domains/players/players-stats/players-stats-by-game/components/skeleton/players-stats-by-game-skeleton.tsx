/**
 * 작성자: KYD
 * 기능: 선수별 경기 통계 리스트 스켈레톤 UI
 * 프로세스 설명: 로딩 중 경기 카드 형태의 스켈레톤 표시
 */
const PlayersStatsByGameSkeleton = () => {
  //SECTION HOOK호출 영역
  const skeletonItems = Array.from({ length: 3 }, (_, index) => index);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <div data-testid="players-stats-by-game-skeleton" className="flex flex-col gap-4">
      {skeletonItems.map((index) => (
        <div key={index} className="animate-pulse rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-2">
              <div className="h-4 w-32 rounded bg-gray-600"></div>
              <div className="h-5 w-48 rounded bg-gray-600"></div>
              <div className="h-3 w-24 rounded bg-gray-600"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-2">
                <div className="h-4 w-20 rounded bg-gray-600"></div>
                <div className="h-5 w-16 rounded bg-gray-600"></div>
              </div>
              <div className="h-5 w-5 rounded bg-gray-600"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersStatsByGameSkeleton;

