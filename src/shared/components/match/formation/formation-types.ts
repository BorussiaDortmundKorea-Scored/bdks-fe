/**
 * 작성자: KYD
 * 기능: 포메이션 렌더링 공통 타입
 * 프로세스 설명: 최신경기(get_latest_match_live_formation)와 경기 평점(get_matches_player_ratings)이
 *              같은 모양을 내려주지만 컬럼 이름이 달라(player_name/korean_name 등) 그대로는 못 섞는다.
 *              두 화면이 같은 컴포넌트를 쓰도록 여기서 한 가지 모양으로 맞춘다.
 *
 *              선택 필드는 "없으면 안 그린다". 값을 넘기는 화면에서만 배지가 나타나므로
 *              화면별 분기 플래그를 늘리지 않고도 정보량 차이를 표현할 수 있다.
 */
export interface IFormationPlayer {
  playerId: string;
  /** 전체 이름. 카드에는 글자로 찍지 않고 img 의 alt · 링크의 aria-label 로만 쓴다 */
  name: string;
  imageUrl: string;
  rating: number;

  //SECTION 값이 있을 때만 배지로 나타나는 것들
  /** 넘기면 0건일 때 평점 숫자 대신 '-' 를 보여준다 */
  ratingCount?: number;
  isCaptain?: boolean;
  goals?: number;
  yellowCards?: number;
  isSentOff?: boolean;
  subInMinute?: number | null;
  subOutMinute?: number | null;
  /** 이 경기 최고 평점 */
  isBestOfTheMatch?: boolean;
  //!SECTION 값이 있을 때만 배지로 나타나는 것들
}

/** 라인별로 묶인 그라운드 선수들 (키 = line_number) */
export type FormationLines = Record<number, IFormationPlayer[]>;
