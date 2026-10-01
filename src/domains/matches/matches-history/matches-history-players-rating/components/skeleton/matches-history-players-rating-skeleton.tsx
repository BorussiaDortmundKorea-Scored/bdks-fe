/**
 * 작성자: KYD
 * 기능: 경기 선수 평점 스켈레톤
 * 프로세스 설명: 본체와 같은 2단 레이아웃을 깔아 로딩이 끝나는 순간 배치가 튀지 않게 한다.
 *              좌측 포메이션은 최신경기(matches-lastest-skeleton)를 그대로 쓰고,
 *              우측은 이 화면에만 있는 경기정보 패널 스켈레톤이다.
 */
import MatchSummaryPanelSkeleton from "../../match-summary-panel/components/skeleton/match-summary-panel-skeleton";
import MatchesHistoryPlayersRatingWrapper from "../wrapper/matches-history-players-rating-wrapper";

const MatchesHistoryPlayersRatingSkeleton = () => {
  return (
    <div className="bdks-grid-2col">
      <MatchesHistoryPlayersRatingWrapper>
        <div data-testid="matches-history-players-rating-skeleton">
          <div className="h-[100px] w-full bg-gray-600"></div>
        </div>
      </MatchesHistoryPlayersRatingWrapper>
      <MatchSummaryPanelSkeleton />
    </div>
  );
};

export default MatchesHistoryPlayersRatingSkeleton;
