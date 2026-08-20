/**
 * 작성자: KYD
 * 기능: 선수 프로필 이미지의 "이미지명"과 Supabase Storage 절대 URL 사이 변환 유틸
 * 프로세스 설명:
 *  - 관리자 폼에서는 이미지명(예: "meyer")만 입력받고, 저장 직전 full/head 절대 URL 로 변환한다.
 *  - URL 은 현재 환경의 VITE_SUPABASE_URL 을 기준으로 생성되므로 dev/prod 각각의 스토리지를 가리킨다.
 *  - 경로 규칙: {SUPABASE_URL}/storage/v1/object/public/players/{full|head}/{full_|head_}{name}.{ext}
 */

const STORAGE_BASE = `${(import.meta.env.VITE_SUPABASE_URL as string) ?? ""}/storage/v1/object/public/players`;

const DEFAULT_EXT = "png";

export interface IPlayerImageUrls {
  full_profile_image_url: string;
  head_profile_image_url: string;
}

/**
 * 이미지명 → full/head 절대 URL 로 변환한다.
 * 확장자를 생략하면 png 로 처리하고, 확장자를 포함하면(예: "meyer.webp") 그대로 사용한다.
 * 빈 값이면 빈 문자열을 반환한다.
 */
export const buildPlayerImageUrls = (imageName: string): IPlayerImageUrls => {
  const trimmed = imageName.trim();
  if (!trimmed) {
    return { full_profile_image_url: "", head_profile_image_url: "" };
  }

  const dotIndex = trimmed.lastIndexOf(".");
  const hasExt = dotIndex > 0;
  const base = hasExt ? trimmed.slice(0, dotIndex) : trimmed;
  const ext = hasExt ? trimmed.slice(dotIndex + 1) : DEFAULT_EXT;

  return {
    full_profile_image_url: `${STORAGE_BASE}/full/full_${base}.${ext}`,
    head_profile_image_url: `${STORAGE_BASE}/head/head_${base}.${ext}`,
  };
};

/**
 * 기존에 저장된 절대 URL → 이미지명 으로 역변환한다. (수정 폼 프리필용)
 * 예: ".../head/head_meyer.png" → "meyer", ".../full/full_meyer.webp" → "meyer.webp"
 * png 는 기본값이라 생략하고, 그 외 확장자는 유지한다.
 */
export const extractPlayerImageName = (url?: string | null): string => {
  if (!url) return "";
  const fileName = url.split("/").pop() ?? "";
  const withoutPrefix = fileName.replace(/^(full_|head_)/, "");
  return withoutPrefix.replace(/\.png$/i, "");
};
