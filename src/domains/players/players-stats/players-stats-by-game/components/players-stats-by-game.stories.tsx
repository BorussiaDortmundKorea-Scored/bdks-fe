import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import PlayersStatsByGame from "@players/players-stats/players-stats-by-game/components/players-stats-by-game";
import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayersStatsByGameSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/players-stats-by-game-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof PlayersStatsByGame> = {
  title: "Players/PlayersStats/PlayersStatsByGame",
  component: PlayersStatsByGame,
  args: {
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
          <ReactQueryBoundary skeleton={<PlayersStatsByGameSkeleton />} errorFallback={PlayersStatsByGameError}>
            <Story />
          </ReactQueryBoundary>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof PlayersStatsByGame>;

export const Iphone5: Story = {
  globals: { viewport: { value: "iphone5", isRotated: false } },
};

export const Iphone12: Story = {
  globals: { viewport: { value: "iphone12", isRotated: false } },
};

export const GalaxyS24: Story = {
  globals: { viewport: { value: "GalaxyS24", isRotated: false } },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_stats_by_game", async () => {
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
        http.post("*/rest/v1/rpc/get_player_stats_by_game", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
