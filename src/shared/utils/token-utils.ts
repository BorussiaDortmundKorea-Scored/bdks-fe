/**
 * 작성자: KYD
 * 기능: Supabase 토큰 관리 유틸리티
 * 프로세스 설명: Supabase 객체 토큰에서 필요한 정보를 추출하는 함수들
 */

interface SupabaseTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: {
    id: string;
    email?: string;
    [key: string]: unknown;
  };
}

/**
 * Supabase 객체 토큰에서 access_token을 추출
 */
export const getAccessTokenFromSupabaseToken = (): string | null => {
  try {
    // Supabase auth-token 키 패턴 찾기
    const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
    );

    if (supabaseKeys.length === 0) {
      console.warn("Supabase auth-token을 찾을 수 없습니다.");
      return null;
    }

    const supabaseKey = supabaseKeys[0];
    const tokenData = localStorage.getItem(supabaseKey);

    if (!tokenData) {
      console.warn("Supabase 토큰 데이터가 없습니다.");
      return null;
    }

    const parsedToken: SupabaseTokenData = JSON.parse(tokenData);
    return parsedToken.access_token;
  } catch (error) {
    console.error("Supabase 토큰 파싱 오류:", error);
    return null;
  }
};

/**
 * Supabase 객체 토큰에서 refresh_token을 추출
 */
export const getRefreshTokenFromSupabaseToken = (): string | null => {
  try {
    const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
    );

    if (supabaseKeys.length === 0) return null;

    const supabaseKey = supabaseKeys[0];
    const tokenData = localStorage.getItem(supabaseKey);

    if (!tokenData) return null;

    const parsedToken: SupabaseTokenData = JSON.parse(tokenData);
    return parsedToken.refresh_token;
  } catch (error) {
    console.error("Supabase 토큰 파싱 오류:", error);
    return null;
  }
};

/**
 * Supabase 객체 토큰에서 만료 시간을 추출
 */
export const getTokenExpiryFromSupabaseToken = (): number | null => {
  try {
    const supabaseKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
    );

    if (supabaseKeys.length === 0) return null;

    const supabaseKey = supabaseKeys[0];
    const tokenData = localStorage.getItem(supabaseKey);

    if (!tokenData) return null;

    const parsedToken: SupabaseTokenData = JSON.parse(tokenData);
    return parsedToken.expires_at;
  } catch (error) {
    console.error("Supabase 토큰 파싱 오류:", error);
    return null;
  }
};

/**
 * 토큰이 만료되었는지 확인
 */
export const isTokenExpired = (): boolean => {
  const expiry = getTokenExpiryFromSupabaseToken();
  if (!expiry) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= expiry;
};
