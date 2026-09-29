import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";
import { reactRouterParameters } from "storybook-addon-remix-react-router";

import MatchesHistoryPlayersRatingErrorFallback from "@matches/matches-history/matches-history-players-rating/components/error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRating from "@matches/matches-history/matches-history-players-rating/components/matches-history-players-rating";
import MatchesHistoryPlayersRatingSkeleton from "@matches/matches-history/matches-history-players-rating/components/skeleton/matches-history-players-rating-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesHistoryPlayersRating> = {
  title: "Matches/MatchesHistory/PlayersRating",
  component: MatchesHistoryPlayersRating,
  // 컴포넌트가 useParams 로 matchId 를 읽으므로 경로를 지정해 준다
  parameters: {
    reactRouter: reactRouterParameters({
      location: { pathParams: { matchId: "match-001" } },
      routing: { path: "/match/:matchId/ratings" },
    }),
  },
  decorators: [
    (Story) => (
      <ReactQueryBoundary
        skeleton={<MatchesHistoryPlayersRatingSkeleton />}
        errorFallback={MatchesHistoryPlayersRatingErrorFallback}
      >
        <Story />
      </ReactQueryBoundary>
    ),
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
