// SelectBox 옵션: label = 저장값(코드), value = 화면표시 (yd-ui SelectBox는 value를 표시하고 hook.label로 코드 회수)
export const TRANSFER_DIRECTION_OPTIONS = [
  { label: "IN", value: "영입" },
  { label: "OUT", value: "방출" },
];

export const TRANSFER_TYPE_OPTIONS = [
  { label: "PERMANENT", value: "완전이적" },
  { label: "LOAN", value: "임대" },
];

// 리스트 표시용 (짧게)
export const directionText = (direction: string) => (direction === "IN" ? "영입" : "방출");
export const typeText = (type: string) => (type === "LOAN" ? "임대" : "완전");

// edit 모달 defaultValue용 (옵션 value와 정확히 일치해야 함)
export const directionDefaultValue = (direction: string) => (direction === "IN" ? "영입" : "방출");
export const typeDefaultValue = (type: string) => (type === "LOAN" ? "임대" : "완전이적");
