import MatchesHistoryPlayersRatingErrorFallback from "../components/error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRatingSkeleton from "../components/skeleton/matches-history-players-rating-skeleton";
import MatchesHistoryPlayersRatingPage from "./matches-history-players-rating-page";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";
import { reactRouterParameters, withRouter } from "storybook-addon-remix-react-router";

import { AuthContext } from "@auth/contexts/AuthContext";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesHistoryPlayersRatingPage> = {
  title: "Matches/MatchesHistory/PlayersRatingPage",
  component: MatchesHistoryPlayersRatingPage,
  decorators: [
    withRouter,
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
        <AuthContext.Provider value={storybookKakaoAuthMock}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary
              skeleton={<MatchesHistoryPlayersRatingSkeleton />}
              errorFallback={MatchesHistoryPlayersRatingErrorFallback}
            >
              <Story />
            </ReactQueryBoundary>
          </QueryClientProvider>
        </AuthContext.Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesHistoryPlayersRatingPage>;

const defaultRouterParams = {
  reactRouter: reactRouterParameters({
    location: {
      pathParams: { matchId: "match-456" },
    },
    routing: { path: "/match/:matchId/ratings" },
  }),
};

export const Iphone5: Story = {
  parameters: { ...defaultRouterParams },
  globals: { viewport: { value: "iphone5", isRotated: false } },
};

export const Iphone12: Story = {
  parameters: { ...defaultRouterParams },
  globals: { viewport: { value: "iphone12", isRotated: false } },
};

export const GalaxyS24: Story = {
  parameters: { ...defaultRouterParams },
  globals: { viewport: { value: "GalaxyS24", isRotated: false } },
};

export const GalaxyS24Plus: Story = {
  parameters: { ...defaultRouterParams },
  globals: { viewport: { value: "GalaxyS24Plus", isRotated: false } },
};

// 로딩 상태: MSW에서 지연시간 추가
export const Loading: Story = {
  parameters: {
    ...defaultRouterParams,
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_matches_player_ratings", async () => {
          await new Promise((resolve) => setTimeout(resolve, 999999));
          return HttpResponse.json({});
        }),
        http.post("*/rest/v1/rpc/get_match_info", async () => {
          await new Promise((resolve) => setTimeout(resolve, 999999));
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// 에러 상태: MSW에서 에러 응답
export const Error: Story = {
  parameters: {
    ...defaultRouterParams,
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_matches_player_ratings", () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.post("*/rest/v1/rpc/get_match_info", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
