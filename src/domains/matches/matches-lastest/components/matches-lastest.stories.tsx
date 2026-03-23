import { BrowserRouter } from "react-router-dom";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import MatchesLastestErrorFallback from "@matches/matches-lastest/components/error/matches-lastest-error-fallback";
import MatchesLastest from "@matches/matches-lastest/components/matches-lastest";
import MatchesLastestSkeleton from "@matches/matches-lastest/components/skeleton/matches-lastest-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesLastest> = {
  title: "Matches/MatchesLastest/MatchesLastest",
  component: MatchesLastest,
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
            <ReactQueryBoundary skeleton={<MatchesLastestSkeleton />} errorFallback={MatchesLastestErrorFallback}>
              <Story />
            </ReactQueryBoundary>
          </QueryClientProvider>
        </BrowserRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesLastest>;

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
        http.post("*/rest/v1/rpc/get_latest_match_live_formation", async () => {
          await new Promise((resolve) => setTimeout(resolve, 999999));
          return HttpResponse.json({});
        }),
        http.post("*/rest/v1/rpc/get_latest_match_information", async () => {
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
        http.post("*/rest/v1/rpc/get_latest_match_live_formation", () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.post("*/rest/v1/rpc/get_latest_match_information", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
