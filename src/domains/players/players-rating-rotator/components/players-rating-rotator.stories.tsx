import { BrowserRouter } from "react-router-dom";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import PlayersRatingRotatorErrorFallback from "@players/players-rating-rotator/components/error/players-rating-rotator-error-fallback";
import PlayersRatingRotator from "@players/players-rating-rotator/components/players-rating-rotator";
import PlayersRatingRotatorSkeleton from "@players/players-rating-rotator/components/skeleton/players-rating-rotator-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof PlayersRatingRotator> = {
  title: "Players/PlayersRatingRotator",
  component: PlayersRatingRotator,
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
              skeleton={<PlayersRatingRotatorSkeleton />}
              errorFallback={PlayersRatingRotatorErrorFallback}
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

type Story = StoryObj<typeof PlayersRatingRotator>;

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

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_rating_rotator_acc", async () => {
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
        http.post("*/rest/v1/rpc/get_player_rating_rotator_acc", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
