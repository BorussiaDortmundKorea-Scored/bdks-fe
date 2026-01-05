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

  // datetime-local 값은 로컬 시간대(한국 시간)로 입력됨
  // 이를 UTC로 변환하기 위해 한국 시간대로 해석
  const [datePart, timePart] = localDateTimeString.split("T");
  if (!datePart || !timePart) return "";

  // 한국 시간(Asia/Seoul, UTC+9)으로 해석
  const kstDate = new Date(`${datePart}T${timePart}:00+09:00`);

  // UTC로 변환된 ISO 문자열 반환
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

  // UTC 시간을 한국 시간(Asia/Seoul, UTC+9)으로 변환
  // Intl.DateTimeFormat을 사용하여 정확하게 변환
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
