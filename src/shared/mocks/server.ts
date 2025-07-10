// msw/node는 MSW v1 방식입니다
// import { setupServer } from 'msw/node';
// MSW v2 방식으로 변경
import { setupServer } from 'msw/node';

// 또는 'msw/browser'가 될 수 있음
import { handlers } from './handlers/handlers';

export const server = setupServer(...handlers);
