import ReactGA from "react-ga4";
import { HelmetProvider } from "react-helmet-async";

import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OverlayProvider } from "@youngduck/yd-ui/Overlays";

import { queryClient } from "@shared/provider/query-client";
import Router from "@shared/router/Router";

// GA4 초기화 PROD 환경에서만 작동
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

if (GA_MEASUREMENT_ID) {
  ReactGA.initialize(GA_MEASUREMENT_ID);
}

// 로컬 개발 서버(직접 접속 + --host 로 붙은 사내망 기기)에서는 Sentry 로 보내지 않는다.
// 콘솔·에러 오버레이로 이미 보이는 에러라 가치가 없고, 쿼터를 먹어 실제 운영 에러가 유실될 수 있다.
// mode 가 아니라 hostname 으로 판별한다 — 로컬에서 `dev:prod` 로 띄우면 mode 는 prod 가 되기 때문.
const LOCAL_HOSTNAME_PATTERN =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[?::1\]?|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/;

const isLocalHost = LOCAL_HOSTNAME_PATTERN.test(window.location.hostname);

// Sentry 초기화
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // 배포된 dev 환경은 그대로 수집하고 production 과 구분해서 본다 (알림은 production 기준으로만)
  environment: import.meta.env.MODE,
  enabled: !isLocalHost,
  sendDefaultPii: true,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false, // 모든 텍스트 마스킹 비활성화
      maskAllInputs: false, // 모든 입력 필드 마스킹 비활성화
      blockAllMedia: false, // 모든 미디어 차단 비활성화
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/.*\.supabase\.co\/rest\/v1/],
});

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </OverlayProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
