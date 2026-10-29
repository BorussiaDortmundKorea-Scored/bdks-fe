/**
 * 작성자: KYD
 * 기능: 포메이션별 11자리 정의 (관리자 라인업 입력 · 포메이션 선택 드롭다운 공용)
 * 프로세스 설명: 포메이션 모양은 축구 규칙이라 거의 바뀌지 않으므로 DB 테이블이 아닌 상수로 둔다.
 *              자리는 positions.position_detail_name 으로 적는다. dev/prod 의 position UUID 가 달라
 *              UUID 로 적으면 한쪽에서만 동작하기 때문이다.
 *              배열 순서 = 같은 줄 안에서 왼쪽 → 오른쪽 (positions.sort_order 가 같을 때의 기준).
 *              새 포메이션은 여기 한 줄만 추가하면 드롭다운에 나타난다.
 */

export const FORMATION_SLOTS = {
  "3-4-2-1": ["GK", "LCB", "CB", "RCB", "LWB", "LCM", "RCM", "RWB", "LAM", "RAM", "ST"],
  "3-4-1-2": ["GK", "LCB", "CB", "RCB", "LWB", "LCM", "RCM", "RWB", "CAM", "LS", "RS"],
  "4-2-3-1": ["GK", "LB", "LCB", "RCB", "RB", "LDM", "RDM", "LAM", "CAM", "RAM", "ST"],
  "4-3-3": ["GK", "LB", "LCB", "RCB", "RB", "LCM", "CDM", "RCM", "LW", "ST", "RW"],
} as const satisfies Record<string, readonly string[]>;

export type Formation = keyof typeof FORMATION_SLOTS;

/** 드롭다운 옵션 순서 = 상수 선언 순서 */
export const FORMATION_OPTIONS = Object.keys(FORMATION_SLOTS) as Formation[];

/** matches.formation 은 자유 문자열이라 상수에 있는 값인지 좁혀서 쓴다 */
export const isFormation = (value: string | null | undefined): value is Formation =>
  value != null && Object.hasOwn(FORMATION_SLOTS, value);
