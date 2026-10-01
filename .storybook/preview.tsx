import { HelmetProvider } from "react-helmet-async";

import { GalaxyViewports } from "./constant/galaxy-viewport";
import type { Decorator, Preview } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initialize, mswLoader } from "msw-storybook-addon";
import { withRouter } from "storybook-addon-remix-react-router";
import { INITIAL_VIEWPORTS } from "storybook/viewport";

import { handlers } from "@shared/mocks/handlers/handlers";
import "@shared/style/root.css";

initialize();

/**
 * 스토리는 한 화면에 하나만 뜨고 스토리를 옮길 때마다 처음부터 다시 그려져야 하므로,
 * 캐시를 남기지 않고 재시도도 하지 않는다. (재시도가 있으면 Error 스토리가 늦게 뜬다)
 * 스토리마다 새 인스턴스를 만들어 이전 스토리의 응답이 넘어오지 않게 한다.
 */
const withAppProviders: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    </HelmetProvider>
  );
};

const preview: Preview = {
  /**
   * 배열의 뒤쪽이 바깥을 감싼다 → withRouter(withAppProviders(story)).
   * App.tsx 와 같은 순서로, 라우터가 가장 바깥에 온다.
   * 경로 파라미터가 필요한 스토리는 parameters.reactRouter 로 지정한다.
   */
  decorators: [withAppProviders, withRouter],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
    // 사이드바를 앱의 화면 흐름과 같은 순서로 (나머지는 알파벳순)
    options: {
      storySort: {
        method: "alphabetical",
        order: ["Dashboard", "Matches", "Players", "Auth", "Admin", "Shared", "*"],
      },
    },
    viewport: {
      options: {
        ...INITIAL_VIEWPORTS,
        ...GalaxyViewports,
      },
    },
    msw: {
      handlers: [...handlers],
    },
  },
  loaders: [mswLoader],
  // 요즘 쓰는 폰 중 가장 좁은 축인 360px 기준. 여기서 안 깨지면 나머지 폰은 여유가 있다
  initialGlobals: {
    viewport: { value: "GalaxyS24", isRotated: false },
  },
};

export default preview;
