import { MemoryRouter, Route, Routes } from "react-router-dom";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import MatchesHistoryPlayersRatingErrorFallback from "@matches/matches-history/matches-history-players-rating/components/error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRating from "@matches/matches-history/matches-history-players-rating/components/matches-history-players-rating";
import MatchesHistoryPlayersRatingSkeleton from "@matches/matches-history/matches-history-players-rating/components/skeleton/matches-history-players-rating-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesHistoryPlayersRating> = {
  title: "Matches/MatchesHistory/PlayersRating",
  component: MatchesHistoryPlayersRating,
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
        <MemoryRouter initialEntries={["/match/match-001/ratings"]}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary
              skeleton={<MatchesHistoryPlayersRatingSkeleton />}
              errorFallback={MatchesHistoryPlayersRatingErrorFallback}
            >
              <Routes>
                <Route path="/match/:matchId/ratings" element={<Story />} />
              </Routes>
            </ReactQueryBoundary>
          </QueryClientProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesHistoryPlayersRating>;

export const Iphone5: Story = {
  globals: { viewport: { value: "iphone5", isRotated: false } },
};

export const Iphone12: Story = {
  globals: { viewport: { value: "iphone12", isRotated: false } },
};

export const Loading: Story = {
  parameters: {
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

export const Error: Story = {
  parameters: {
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
