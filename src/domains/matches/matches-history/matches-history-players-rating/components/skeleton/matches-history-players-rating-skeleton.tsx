/**
 * 작성자: KYD
 * 기능: 경기 선수 평점 리스트 스켈레톤 컴포넌트
 */
import MatchesHistoryPlayersRatingWrapper from "../wrapper/matches-history-players-rating-wrapper";
import { Camera } from "lucide-react";

const MatchesHistoryPlayersRatingSkeleton = () => {
  //SECTION HOOK호출 영역
  const skeletonItems = Array.from({ length: 11 }, (_, index) => index);
  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <MatchesHistoryPlayersRatingWrapper>
      {/* 헤더 스켈레톤 */}
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="h-[26px] w-[200px] animate-pulse rounded bg-gray-600"></div>
          <div className="h-[16px] w-[120px] animate-pulse rounded bg-gray-600"></div>
        </div>
        <Camera size={24} className="text-primary-100 cursor-pointer" />
      </header>

      {/* 선수단 평점 제목 스켈레톤 */}
      <div className="h-[26px] w-[80px] animate-pulse rounded bg-gray-600"></div>

      {/* 선수 리스트 스켈레톤 */}
      <ul>
        {skeletonItems.map((index) => (
          <li key={index} className="flex h-[72px] w-full items-center justify-between gap-4 px-2 odd:bg-[#20242D]">
            {/* 왼쪽: 선수 정보 스켈레톤 */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
              {/* 선수 이미지 스켈레톤 */}
              <div className="h-[56px] w-[56px] flex-shrink-0 animate-pulse rounded bg-gray-600"></div>

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/* 선수 이름 스켈레톤 */}
                <div className="h-[26px] w-[80px] animate-pulse rounded bg-gray-600"></div>

                {/* 포지션 및 배지들 스켈레톤 */}
                <div className="flex flex-wrap items-center gap-1">
                  <div className="h-[16px] w-[40px] animate-pulse rounded bg-gray-600"></div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 평점 및 BOTM 스켈레톤 */}
            <div className="flex flex-shrink-0 items-center gap-2">
              {/* 평점 스켈레톤 */}
              <div className="flex items-center gap-1">
                <div className="h-[16px] w-[16px] animate-pulse rounded bg-gray-600"></div>
                <div className="h-[12px] w-[24px] animate-pulse rounded bg-gray-600"></div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </MatchesHistoryPlayersRatingWrapper>
  );
};

export default MatchesHistoryPlayersRatingSkeleton;
