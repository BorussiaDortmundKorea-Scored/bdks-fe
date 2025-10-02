import { BrowserRouter } from "react-router-dom";

import MatchesHistoryPlayersRatingErrorFallback from "../components/error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRatingSkeleton from "../components/skeleton/matches-history-players-rating-skeleton";
import MatchesHistoryPlayersRatingPage from "./matches-history-players-rating-page";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesHistoryPlayersRatingPage> = {
  title: "Matches/MatchesHistoryPlayersRatingPage",
  component: MatchesHistoryPlayersRatingPage,

  decorators: [
    (Story) => {
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
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary
              skeleton={<MatchesHistoryPlayersRatingSkeleton />}
              errorFallback={MatchesHistoryPlayersRatingErrorFallback}
            >
              <Story />
            </ReactQueryBoundary>
          </QueryClientProvider>
        </BrowserRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesHistoryPlayersRatingPage>;

export const Iphone5: Story = {
  globals: {
    viewport: { value: "iphone5", isRotated: false },
  },
};

export const Iphone12: Story = {
  globals: {
    viewport: { value: "iphone12", isRotated: false },
  },
};

export const GalaxyS24: Story = {
  globals: {
    viewport: { value: "GalaxyS24", isRotated: false },
  },
};

export const GalaxyS24Plus: Story = {
  globals: {
    viewport: { value: "GalaxyS24Plus", isRotated: false },
  },
};

// 로딩 상태: MSW에서 지연시간 추가
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        // 글로벌 핸들러를 덮어쓰기 위해 더 구체적인 패턴 사용
        http.post("*/rest/v1/rpc/get_matches_player_ratings", async () => {
          console.log("MSW: 로딩 상태 시뮬레이션");
          await new Promise((resolve) => setTimeout(resolve, 999999)); // 무한 로딩
          return HttpResponse.json({});
        }),
        http.post("*/rest/v1/rpc/get_match_info", async () => {
          console.log("MSW: 매치 정보 로딩 상태 시뮬레이션");
          await new Promise((resolve) => setTimeout(resolve, 999999)); // 무한 로딩
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// 에러 상태: MSW에서 에러 응답
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        // 글로벌 핸들러를 덮어쓰기 위해 더 구체적인 패턴 사용
        http.post("*/rest/v1/rpc/get_matches_player_ratings", () => {
          console.log("MSW: 에러 상태 시뮬레이션");
          return new HttpResponse(null, { status: 500 });
        }),
        http.post("*/rest/v1/rpc/get_match_info", () => {
          console.log("MSW: 매치 정보 에러 상태 시뮬레이션");
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
