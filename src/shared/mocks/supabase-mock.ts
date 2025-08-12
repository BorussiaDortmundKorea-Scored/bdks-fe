import { vi } from "vitest";

/**
 * Supabase RPC 호출을 모킹하는 공통 함수
 * MSW가 실제 HTTP 요청을 가로채도록 실제 fetch 요청을 보냄
 */
export const mockSupabaseRpc = () => {
  vi.mock("@shared/api/config/supabaseClient", () => ({
    supabase: {
      rpc: vi.fn().mockImplementation((functionName: string) => {
        // MSW가 가로채도록 실제 fetch 요청을 보냄
        return fetch(`https://dummy.supabase.co/rest/v1/rpc/${functionName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            // Supabase RPC 응답 형식에 맞게 반환
            return { data, error: null };
          });
      }),
    },
  }));
};

/**
 * Supabase RPC 모킹을 전역적으로 설정
 * setupTests.js에서 호출하여 모든 테스트에서 사용
 */
export const setupSupabaseMock = () => {
  mockSupabaseRpc();
};

/**
 * 개별 테스트에서 Supabase RPC 모킹을 설정하는 함수
 * 특정 테스트에서만 다른 모킹이 필요한 경우 사용
 */
export const setupIndividualSupabaseMock = () => {
  return vi.mock("@shared/api/config/supabaseClient", () => ({
    supabase: {
      rpc: vi.fn().mockImplementation((functionName: string) => {
        return fetch(`https://dummy.supabase.co/rest/v1/rpc/${functionName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            return { data, error: null };
          });
      }),
    },
  }));
};
