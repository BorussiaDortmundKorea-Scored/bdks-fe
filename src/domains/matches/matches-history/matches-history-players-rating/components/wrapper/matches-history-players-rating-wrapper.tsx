/**
 * 작성자: KYD
 * 기능: 경기 선수 평점 화면 레이아웃 쉘 (스켈레톤/에러용) + 2단 배치 클래스 공유
 * 프로세스 설명: 본체는 공용 FormationBoard 가 쉘까지 그리므로, 여기서는 스켈레톤·에러가
 *              같은 껍데기를 쓰도록 공용 FormationShell 에 위임만 한다.
 */
import FormationShell from "@shared/components/match/formation/formation-shell";

/**
 * 대시보드와 같은 2단 레이아웃 (본체 / 스켈레톤 공통).
 * 좁은 화면은 1열, 넓은 화면(>=1024px)은 [좌 450px 포메이션 / 우 나머지 경기정보].
 * 두 곳에 같은 클래스를 적으면 한쪽만 고쳐져 어긋나므로 상수로 공유한다.
 */
export const PLAYERS_RATING_GRID_CLASS =
  "mx-auto grid w-full max-w-[450px] grid-cols-1 gap-4 min-[1024px]:max-w-none min-[1024px]:grid-cols-[450px_minmax(0,1fr)]";

const MatchesHistoryPlayersRatingWrapper = ({ children }: { children: React.ReactNode }) => {
  return <FormationShell>{children}</FormationShell>;
};

export default MatchesHistoryPlayersRatingWrapper;
