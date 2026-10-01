/**
 * 작성자: KYD
 * 기능: 경기 선수 평점 화면 레이아웃 쉘 (스켈레톤/에러용)
 * 프로세스 설명: 본체는 공용 FormationBoard 가 쉘까지 그리므로, 여기서는 스켈레톤·에러가
 *              같은 껍데기를 쓰도록 공용 FormationShell 에 위임만 한다.
 *              2단 배치는 root.css 의 .bdks-grid-2col 이 담당한다.
 */
import FormationShell from "@shared/components/match/formation/formation-shell";

const MatchesHistoryPlayersRatingWrapper = ({ children }: { children: React.ReactNode }) => {
  return <FormationShell>{children}</FormationShell>;
};

export default MatchesHistoryPlayersRatingWrapper;
