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
        <div key={index} className="bg-background-tertiary animate-pulse p-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col items-start gap-1">
              {/* 리그+시즌+라운드: text-yds-c1m (14px/16px) */}
              <div className="bg-background-fifth h-[16px] w-32 rounded"></div>
              {/* 상대팀+홈어웨이: text-yds-s2 (20px/26px) */}
              <div className="bg-background-fifth h-[26px] w-40 rounded"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-1">
                {/* 골/도움: text-yds-c1m (14px/16px) */}
                <div className="bg-background-fifth h-[16px] w-20 rounded"></div>
                {/* 평점: text-yds-s2 (20px/26px) */}
                <div className="bg-background-fifth h-[26px] w-16 rounded"></div>
              </div>
              <div className="bg-background-fifth h-5 w-5 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlayersStatsByGameSkeleton;

