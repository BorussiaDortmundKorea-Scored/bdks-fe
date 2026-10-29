/**
 * 작성자: KYD
 * 기능: 라인업 관리 스켈레톤 컴포넌트
 * 프로세스 설명: 라인업 데이터 로딩 중 표시되는 스켈레톤 화면. 기본 탭인 보드 모양(헤더 + 우측 탭, 옐로우 월 보드)을 따른다.
 *              보드는 본체와 같은 공용 FormationShell 을 써서 로딩이 끝나도 크기가 튀지 않게 한다.
 */
import FormationShell from "@shared/components/match/formation/formation-shell";

//SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수
/** 4-2-3-1 모양으로 자리 수만 맞춘다 (1선 → 5선) */
const SKELETON_LINES = [1, 3, 2, 4, 1];
const PULSE_CLASS = "bg-primary-100/20 animate-pulse";
//!SECTION 리렌더링이 불필요한영역: 매직넘버, 문자열, 상수

const AdminMatchLineupSkeleton = () => {
  return (
    <div className="flex h-full w-full flex-col" data-testid="admin-match-lineup-skeleton">
      {/* 헤더: 제목 · 보드|표 탭 */}
      <div className="flex w-full items-center justify-between p-4">
        <div className={`${PULSE_CLASS} h-6 w-24 rounded`} />
        <div className={`${PULSE_CLASS} h-8 w-28 rounded`} />
      </div>

      {/* 보드 */}
      <div className="w-full max-w-[480px] px-4">
        <FormationShell>
          <div className="bg-background-secondary-layer flex h-full w-full flex-col rounded-[4px] p-2">
            <div className="flex flex-col gap-1">
              <div className={`${PULSE_CLASS} h-5 w-40 rounded`} />
              <div className={`${PULSE_CLASS} h-4 w-28 rounded`} />
            </div>
            <div className="flex flex-1 flex-col justify-between py-4">
              {SKELETON_LINES.map((count, lineIndex) => (
                <div key={lineIndex} className="flex justify-around">
                  {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className={`${PULSE_CLASS} h-12 w-12 rotate-45`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FormationShell>
      </div>
    </div>
  );
};

export default AdminMatchLineupSkeleton;
