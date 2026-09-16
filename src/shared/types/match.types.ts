// DB CHECK 제약조건 기반 타입 정의
// matches.home_away: 'HOME' | 'AWAY'
// 조회 RPC 는 text_home_away 라는 이름으로도 같은 값을 내려준다.

export type HomeAway = "HOME" | "AWAY";
