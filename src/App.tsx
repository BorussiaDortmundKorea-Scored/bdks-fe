import { HelmetProvider } from "react-helmet-async";

import * as Sentry from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { OvelayProvider } from "@youngduck/yd-ui/Overlays";

import { queryClient } from "@shared/provider/query-client";
import Router from "@shared/router/Router";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
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
        <OvelayProvider>
          <Router />
          <ReactQueryDevtools initialIsOpen={false} />
        </OvelayProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
