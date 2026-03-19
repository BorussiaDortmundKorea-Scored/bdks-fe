// DB CHECK 제약조건 기반 타입 정의
// match_lineups.lineup_type: 'STARTING' | 'BENCH'
// match_lineups.substitution_status: 'NONE' | 'SUBSTITUTED_OUT' | 'SUBSTITUTED_IN'

export type LineupType = "STARTING" | "BENCH";

export type SubstitutionStatus = "NONE" | "SUBSTITUTED_IN" | "SUBSTITUTED_OUT";
