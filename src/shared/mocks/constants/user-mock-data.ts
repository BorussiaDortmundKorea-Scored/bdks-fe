import { vi } from "vitest";

// 익명 사용자 mock 데이터
export const anonymousUserMock = {
  id: "익명id여",
  aud: "authenticated",
  role: "authenticated",
  email: "",
  phone: "",
  last_sign_in_at: "2025-08-12T16:05:55.199244225Z",
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: "2025-08-12T15:30:12.614313Z",
  updated_at: "2025-08-12T16:05:55.206288Z",
  is_anonymous: true,
};

// 카카오 사용자 mock 데이터
export const kakaoUserMock = {
  id: "카카오id여",
  aud: "authenticated",
  role: "authenticated",
  email: "user@example.com",
  phone: "",
  last_sign_in_at: "2025-08-12T15:30:12.620044774Z",
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: "2025-08-12T15:30:12.614313Z",
  updated_at: "2025-08-12T15:30:12.624367Z",
  is_anonymous: false,
};

// 공통 session mock 데이터
export const sessionMock = null;

// 공통 signOut mock 함수
export const signOutMock = vi.fn();

// 익명 사용자 auth context mock 반환 함수
export const getAnonymousUserAuthMock = () => ({
  user: anonymousUserMock,
  session: sessionMock,
  signOut: signOutMock,
});

// 카카오 사용자 auth context mock 반환 함수
export const getKakaoUserAuthMock = () => ({
  user: kakaoUserMock,
  session: sessionMock,
  signOut: signOutMock,
});
