/**
 * 작성자: KYD
 * 기능: 경기 시간 관련 유틸리티 함수
 * 프로세스 설명: datetime-local 입력값을 한국 시간으로 해석하여 UTC로 변환, 또는 UTC를 한국 시간으로 변환
 */

/**
 * datetime-local 입력값(한국 시간)을 UTC ISO 문자열로 변환
 * @param localDateTimeString - datetime-local 형식의 문자열 (예: "2025-11-08T14:30")
 * @returns UTC ISO 문자열 (예: "2025-11-08T05:30:00.000Z")
 */
export const convertLocalToUTC = (localDateTimeString: string): string => {
  if (!localDateTimeString) return "";

  const [datePart, timePart] = localDateTimeString.split("T");
  if (!datePart || !timePart) return "";

  const kstDate = new Date(`${datePart}T${timePart}:00+09:00`);

  return kstDate.toISOString();
};

/**
 * UTC ISO 문자열을 datetime-local 형식(한국 시간)으로 변환
 * @param utcIsoString - UTC ISO 문자열 또는 Date 객체 (예: "2025-11-08T05:30:00.000Z")
 * @returns datetime-local 형식의 문자열 (예: "2025-11-08T14:30")
 */
export const convertUTCToLocal = (utcIsoString: string | Date | null | undefined): string => {
  if (!utcIsoString) return "";

  const date = typeof utcIsoString === "string" ? new Date(utcIsoString) : utcIsoString;

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  const hours = parts.find((p) => p.type === "hour")?.value;
  const minutes = parts.find((p) => p.type === "minute")?.value;

  if (!year || !month || !day || !hours || !minutes) return "";

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * datetime-local 입력값(한국 시간)에서 KST 기준 날짜(YYYY-MM-DD)를 추출
 * match_date를 match_start_time에서 자동 추출하여 UTC/KST 날짜 불일치 방지
 */
export const extractKSTDateFromLocal = (localDateTimeString: string): string => {
  if (!localDateTimeString) return "";

  const [datePart] = localDateTimeString.split("T");
  return datePart || "";
};

/**
 * 경기 시작 시간(datetime-local, KST)으로부터 4개 시간 필드를 자동 계산
 * - first_half_end_time: 시작 + 45분
 * - second_half_start_time: 시작 + 60분 (하프타임 15분)
 * - second_half_end_time: 시작 + 105분
 */
export const calculateMatchTimes = (
  matchStartTimeLocal: string,
): {
  match_start_time: string;
  first_half_end_time: string;
  second_half_start_time: string;
  second_half_end_time: string;
} => {
  if (!matchStartTimeLocal) {
    return {
      match_start_time: "",
      first_half_end_time: "",
      second_half_start_time: "",
      second_half_end_time: "",
    };
  }

  const [datePart, timePart] = matchStartTimeLocal.split("T");
  if (!datePart || !timePart) {
    return {
      match_start_time: "",
      first_half_end_time: "",
      second_half_start_time: "",
      second_half_end_time: "",
    };
  }

  const startDate = new Date(`${datePart}T${timePart}:00+09:00`);

  const addMinutes = (date: Date, minutes: number): string => {
    const result = new Date(date.getTime() + minutes * 60 * 1000);
    return convertUTCToLocal(result);
  };

  return {
    match_start_time: matchStartTimeLocal,
    first_half_end_time: addMinutes(startDate, 45),
    second_half_start_time: addMinutes(startDate, 60),
    second_half_end_time: addMinutes(startDate, 105),
  };
};
