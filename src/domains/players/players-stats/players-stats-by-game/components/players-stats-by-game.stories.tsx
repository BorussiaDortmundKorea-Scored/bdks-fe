import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";

import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayersStatsByGame from "@players/players-stats/players-stats-by-game/components/players-stats-by-game";
import PlayersStatsByGameSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/players-stats-by-game-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof PlayersStatsByGame> = {
  title: "Players/PlayersStats/PlayersStatsByGame",
  component: PlayersStatsByGame,
  args: {
    playerId: "player-123",
  },
  decorators: [
    (Story) => (
      <ReactQueryBoundary skeleton={<PlayersStatsByGameSkeleton />} errorFallback={PlayersStatsByGameError}>
        <Story />
      </ReactQueryBoundary>
    ),
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
