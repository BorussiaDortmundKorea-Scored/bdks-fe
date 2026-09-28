/**
 * 작성자: KYD
 * 기능: 경기 요약 패널 스켈레톤
 * 프로세스 설명: 본체 패널과 같은 카드 5장·같은 행 수를 깔아 로딩이 끝나는 순간 레이아웃이 튀지 않게 한다.
 */

/** 본체 패널 카드 순서와 각 카드의 행 수 (경기 요약 / 최고 평점 / 득점·도움 / 경고·퇴장 / 교체 기록) */
const PANEL_CARD_ROWS = [2, 1, 3, 1, 1];

const MatchSummaryPanelSkeleton = () => {
  return (
    <aside className="flex w-full flex-col gap-4" data-testid="match-summary-panel-skeleton">
      {PANEL_CARD_ROWS.map((rowCount, cardIndex) => (
        <section key={cardIndex} className="bg-background-secondary flex w-full flex-col gap-2 rounded-[4px] p-4">
          {/* 카드 제목 */}
          <div className="h-[16px] w-[80px] animate-pulse rounded bg-white/5" />
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center justify-between gap-2">
              <div className="h-[16px] w-[120px] animate-pulse rounded bg-white/5" />
              <div className="h-[16px] w-[40px] animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </section>
      ))}
    </aside>
  );
};

export default MatchSummaryPanelSkeleton;
