import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  // 기본 설정 없이 개별적인 useQuery, useMutation에서 설정.
  // 각 도메인별로 다른 캐시 전략과 재시도 로직을 적용 하고자함
  // APP.TSX에서 하나의 QueryClient 인스턴스 제공
});
