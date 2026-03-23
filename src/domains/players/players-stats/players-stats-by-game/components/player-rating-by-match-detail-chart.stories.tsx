import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import PlayerRatingByMatchDetailChart from "@players/players-stats/players-stats-by-game/components/player-rating-by-match-detail-chart";
import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayerRatingByMatchDetailChartSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/player-rating-by-match-detail-chart-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof PlayerRatingByMatchDetailChart> = {
  title: "Players/PlayersStats/PlayerRatingByMatchDetailChart",
  component: PlayerRatingByMatchDetailChart,
  args: {
    matchId: "match-001",
    playerId: "player-123",
  },
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
        <QueryClientProvider client={queryClient}>
          <ReactQueryBoundary
            skeleton={<PlayerRatingByMatchDetailChartSkeleton />}
            errorFallback={PlayersStatsByGameError}
          >
            <Story />
          </ReactQueryBoundary>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof PlayerRatingByMatchDetailChart>;

export const Default: Story = {};

export const NoData: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
          return HttpResponse.json({ my_ratings: [], other_ratings: [] });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", async () => {
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
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
