import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";

import MatchesHistoryErrorFallback from "@matches/matches-history/components/error/matches-history-error-fallback";
import MatchesHistory from "@matches/matches-history/components/matches-history";
import MatchesHistorySkeleton from "@matches/matches-history/components/skeleton/matches-history-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesHistory> = {
  title: "Matches/MatchesHistory/MatchesHistory",
  component: MatchesHistory,
  decorators: [
    (Story) => (
      <ReactQueryBoundary skeleton={<MatchesHistorySkeleton />} errorFallback={MatchesHistoryErrorFallback}>
        <Story />
      </ReactQueryBoundary>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesHistory>;

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
        http.post("*/rest/v1/rpc/get_all_finish_match_lists", async () => {
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
        http.post("*/rest/v1/rpc/get_all_finish_match_lists", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
