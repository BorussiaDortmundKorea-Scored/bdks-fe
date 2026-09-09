// DB CHECK 제약조건 기반 타입 정의
// match_lineups.lineup_type: 'STARTING' | 'BENCH'
// 교체는 투입(sub_in_*) / 아웃(sub_out_*) 두 시점을 각각 저장한다.
// 교체로 들어온 선수가 다시 교체로 나가는 경우를 한 행으로 표현하기 위함.

export type LineupType = "STARTING" | "BENCH";
