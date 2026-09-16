import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "@shared/mocks/server";
import { setupSupabaseMock } from "@shared/mocks/supabase-mock";

// Supabase RPC 모킹 설정
setupSupabaseMock();

// jsdom 에는 scrollIntoView 가 없다. yd-ui SelectBox 가 드롭다운을 열 때 호출하므로 없으면 터진다
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

// 모든 api 요청을 가로채기 위해 사용
beforeAll(() => server.listen());

// 각 테스트 케이스 실행 후 핸들러 초기화
afterEach(() => server.resetHandlers());

// 모든 테스트 케이스 실행 후 서버 종료
afterAll(() => server.close());
