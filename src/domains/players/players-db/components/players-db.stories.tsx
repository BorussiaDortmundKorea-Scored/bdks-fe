import { BrowserRouter } from "react-router-dom";

import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import { AuthContext } from "@auth/contexts/AuthContext";

import PlayersDbErrorFallback from "@players/players-db/components/error/players-db-error-fallback";
import PlayersDb from "@players/players-db/components/players-db";
import PlayersDbSkeleton from "@players/players-db/components/skeleton/players-db-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const mockAuthValue = {
  user: { id: "mock-user-id", email: "user@example.com", is_anonymous: false } as never,
  session: null,
  profile: null,
  signOut: async () => {},
  deleteAccount: async () => ({ success: true }),
};

const meta: Meta<typeof PlayersDb> = {
  title: "Players/PlayersDb",
  component: PlayersDb,
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
          <AuthContext.Provider value={mockAuthValue}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryBoundary skeleton={<PlayersDbSkeleton />} errorFallback={PlayersDbErrorFallback}>
                <Story />
              </ReactQueryBoundary>
            </QueryClientProvider>
          </AuthContext.Provider>
        </BrowserRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof PlayersDb>;

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
        http.post("*/rest/v1/rpc/get_all_players_db_with_my_ratings", async () => {
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
        http.post("*/rest/v1/rpc/get_all_players_db_with_my_ratings", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
