// SelectBox 옵션: label = 저장값(코드), value = 화면표시 (yd-ui SelectBox는 value를 표시하고 hook.label로 코드 회수)
export const TRANSFER_DIRECTION_OPTIONS = [
  { label: "IN", value: "영입" },
  { label: "OUT", value: "방출" },
];

export const TRANSFER_TYPE_OPTIONS = [
  { label: "PERMANENT", value: "완전이적" },
  { label: "LOAN", value: "임대" },
  { label: "RETIRED", value: "은퇴" },
];

/** 은퇴는 상대 클럽·이적금액이 없어 폼에서 두 칸을 숨기고 null 로 보낸다 */
export const isRetiredType = (type: string) => type === "RETIRED";

const TYPE_TEXT: Record<string, string> = { PERMANENT: "완전", LOAN: "임대", RETIRED: "은퇴" };
const TYPE_DEFAULT_VALUE: Record<string, string> = { PERMANENT: "완전이적", LOAN: "임대", RETIRED: "은퇴" };

// 리스트 표시용 (짧게)
export const directionText = (direction: string) => (direction === "IN" ? "영입" : "방출");
export const typeText = (type: string) => TYPE_TEXT[type] ?? "완전";

// edit 모달 defaultValue용 (옵션 value와 정확히 일치해야 함)
export const directionDefaultValue = (direction: string) => (direction === "IN" ? "영입" : "방출");
export const typeDefaultValue = (type: string) => TYPE_DEFAULT_VALUE[type] ?? "완전이적";
