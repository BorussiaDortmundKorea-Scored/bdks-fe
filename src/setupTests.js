import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./mocks/server";

// 모든 api 요청을 가로채기 위해 사용
beforeAll(() => server.listen());

// 각 테스트 케이스 실행 후 핸들러 초기화
afterEach(() => server.resetHandlers());

// 모든 테스트 케이스 실행 후 서버 종료
afterAll(() => server.close());
