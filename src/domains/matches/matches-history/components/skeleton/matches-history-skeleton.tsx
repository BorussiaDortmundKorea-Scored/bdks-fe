/**
 * 작성자: KYD
 * 기능:
 * 프로세스 설명: 프로세스 복잡시 노션링크 첨부권장
 */
import MatchesHistoryWrapper from "../wrapper/matches-history-wrapper";

const MatchesHistorySkeleton = () => {
  //SECTION HOOK호출 영역
  const skeletonItems = Array.from({ length: 6 }, (_, index) => index);

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <MatchesHistoryWrapper>
      <div data-testid="matches-history-skeleton">
        {/* 가로 스크롤 컨테이너 */}
        <ul className="scrollbar-hide-x flex w-full flex-row gap-[8px] overflow-x-scroll">
          {skeletonItems.map((index) => (
            <li key={index} className="flex w-[150px] shrink-0 flex-col gap-2">
              {/* 썸네일 skeleton */}
              <div className="h-[90px] w-[150px] animate-pulse rounded bg-gray-600" />
              {/* 텍스트 블록 skeleton */}
              <div className="flex flex-col gap-1">
                <div className="h-[14px] w-[120px] animate-pulse rounded bg-gray-600" />
                <div className="h-[12px] w-[100px] animate-pulse rounded bg-gray-600" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MatchesHistoryWrapper>
  );
};

export default MatchesHistorySkeleton;
