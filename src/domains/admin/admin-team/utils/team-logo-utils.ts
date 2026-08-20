/**
 * 작성자: KYD
 * 기능: 팀 로고 이미지의 "이미지명"과 Supabase Storage 절대 URL 사이 변환 유틸
 * 프로세스 설명:
 *  - 관리자 폼에서는 이미지명(예: "barcelona")만 입력받고, 저장 직전 절대 URL 로 변환한다.
 *  - URL 은 현재 환경의 VITE_SUPABASE_URL 을 기준으로 생성되므로 dev/prod 각각의 스토리지를 가리킨다.
 *  - 경로 규칙: {SUPABASE_URL}/storage/v1/object/public/clubs/logo_{name}.{ext}
 */

const CLUBS_BASE = `${(import.meta.env.VITE_SUPABASE_URL as string) ?? ""}/storage/v1/object/public/clubs`;

const DEFAULT_EXT = "png";

/**
 * 이미지명 → 팀 로고 절대 URL 로 변환한다.
 * 확장자를 생략하면 png 로 처리하고, 확장자를 포함하면(예: "barcelona.webp") 그대로 사용한다.
 * 빈 값이면 빈 문자열을 반환한다.
 */
export const buildTeamLogoUrl = (imageName: string): string => {
  const trimmed = imageName.trim();
  if (!trimmed) return "";

  const dotIndex = trimmed.lastIndexOf(".");
  const hasExt = dotIndex > 0;
  const base = hasExt ? trimmed.slice(0, dotIndex) : trimmed;
  const ext = hasExt ? trimmed.slice(dotIndex + 1) : DEFAULT_EXT;

  return `${CLUBS_BASE}/logo_${base}.${ext}`;
};

/**
 * 기존에 저장된 절대 URL → 이미지명 으로 역변환한다. (수정 폼 프리필용)
 * 예: ".../clubs/logo_barcelona.png" → "barcelona", ".../clubs/logo_barcelona.webp" → "barcelona.webp"
 * png 는 기본값이라 생략하고, 그 외 확장자는 유지한다.
 */
export const extractTeamLogoName = (url?: string | null): string => {
  if (!url) return "";
  const fileName = url.split("/").pop() ?? "";
  const withoutPrefix = fileName.replace(/^logo_/, "");
  return withoutPrefix.replace(/\.png$/i, "");
};
