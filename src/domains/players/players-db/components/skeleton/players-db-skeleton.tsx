/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import PlayersDbWrapper from "@players/players-db/components/wrapper/players-db-wrapper";

const PlayersDbSkeleton = () => {
  //SECTION HOOK호출 영역
  const skeletonItems = Array.from({ length: 5 }, (_, index) => index);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <PlayersDbWrapper>
      <div data-testid="player-db-skeleton">
        {/* 가로 스크롤 컨테이너 */}
        <ul className="scrollbar-hide-x flex w-full flex-row gap-[8px] overflow-x-scroll">
          {skeletonItems.map((index) => (
            <li key={index} className="flex w-[105px] shrink-0 flex-col items-center gap-[16px]">
              {/* 선수 이미지 skeleton */}
              <div className="h-[80px] w-[80px] animate-pulse rounded bg-gray-600"></div>

              {/* 선수 정보 skeleton */}
              <div className="flex flex-col items-center gap-[2px]">
                {/* 선수 이름 skeleton */}
                <div className="h-[14px] w-[60px] animate-pulse rounded bg-gray-600"></div>

                {/* 평점 정보 skeleton */}
                <div className="flex items-center gap-[4px]">
                  <div className="h-[12px] w-[25px] animate-pulse rounded bg-gray-600"></div>
                  <span className="text-primary-100 text-xs">/</span>
                  <div className="h-[12px] w-[25px] animate-pulse rounded bg-gray-600"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PlayersDbWrapper>
  );
};

export default PlayersDbSkeleton;
