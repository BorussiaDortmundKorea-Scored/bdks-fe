/**
 * 작성자: KYD
 * 기능: 평점 입력 화면 로딩 스켈레톤
 * 프로세스 설명: 실제 컴포넌트 구조와 동일한 레이아웃으로 로딩 상태 표시
 */
import LayoutWithHeaderFooter from "@shared/provider/layout-with-header-footer";

interface IMatchesLastestPlayerRatingSkeleton {}

const MatchesLastestPlayerRatingSkeleton: React.FC<IMatchesLastestPlayerRatingSkeleton> = () => {
  //SECTION HOOK호출 영역

  //!SECTION HOOK호출 영역

  //SECTION 상태값 영역

  //!SECTION 상태값 영역

  //SECTION 메서드 영역

  //!SECTION 메서드 영역

  return (
    <>
      <LayoutWithHeaderFooter>
        <div className="h-auto w-full py-6">
          <div className="flex flex-col gap-3">
            {/* 경기 정보 헤더 스켈레톤 */}
            <div className="flex items-center justify-between px-4">
              <div className="flex w-full flex-col flex-wrap gap-0">
                {/* 경기 대결 정보 스켈레톤 */}
                <div className="mb-1 h-[20px] w-[200px] animate-pulse rounded bg-gray-600" />
                <div className="flex w-full justify-between">
                  {/* 시즌/리그/라운드 정보 스켈레톤 */}
                  <div className="flex gap-2">
                    <div className="h-[16px] w-[80px] animate-pulse rounded bg-gray-600" />
                    <div className="h-[16px] w-[100px] animate-pulse rounded bg-gray-600" />
                    <div className="h-[16px] w-[60px] animate-pulse rounded bg-gray-600" />
                  </div>
                  {/* 현재 경기 시간 스켈레톤 */}
                  <div className="h-[16px] w-[80px] animate-pulse rounded bg-gray-600" />
                </div>
              </div>
            </div>

            {/* 선수 이미지 영역 스켈레톤 */}
            <div className="flex flex-col items-start gap-3">
              {/* 선수 이미지 스켈레톤 */}
              <div className="mx-auto h-[300px] w-[300px] animate-pulse rounded-lg bg-gray-600" />
              {/* 선수 이름 스켈레톤 */}
              <div className="w-full text-center">
                <div className="mx-auto h-[24px] w-[120px] animate-pulse rounded bg-gray-600" />
              </div>
            </div>

            {/* 선수 데이터 영역 스켈레톤 */}
            <div className="bg-background-secondary flex flex-col gap-2 rounded-lg p-4">
              {/* Goal 정보 스켈레톤 */}
              <div className="flex items-center justify-between">
                <div className="h-[16px] w-[40px] animate-pulse rounded bg-gray-600" />
                <div className="h-[16px] w-[20px] animate-pulse rounded bg-gray-600" />
              </div>
              {/* Assist 정보 스켈레톤 */}
              <div className="flex items-center justify-between">
                <div className="h-[16px] w-[50px] animate-pulse rounded bg-gray-600" />
                <div className="h-[16px] w-[20px] animate-pulse rounded bg-gray-600" />
              </div>
              {/* 평점 정보 스켈레톤 */}
              <div className="flex items-center justify-between">
                <div className="h-[16px] w-[120px] animate-pulse rounded bg-gray-600" />
                <div className="h-[16px] w-[40px] animate-pulse rounded bg-gray-600" />
              </div>
            </div>

            {/* 평점 입력 영역 스켈레톤 */}
            <div className="flex flex-col items-center gap-4">
              {/* 평점 게이지 스켈레톤 */}
              <div className="h-[200px] w-[200px] animate-pulse rounded-full bg-gray-600" />
              {/* 평점 값 표시 스켈레톤 */}
              <div className="h-[32px] w-[80px] animate-pulse rounded bg-gray-600" />
            </div>
          </div>
        </div>
      </LayoutWithHeaderFooter>

      {/* 하단 버튼 스켈레톤 */}
      <div className="flex h-auto w-full items-center justify-center">
        <div className="h-[48px] w-full max-w-[400px] animate-pulse rounded bg-gray-600" />
      </div>
    </>
  );
};

export default MatchesLastestPlayerRatingSkeleton;
