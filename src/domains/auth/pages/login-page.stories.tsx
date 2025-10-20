import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";

import LoginPage from "./login-page";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import PlayersRatingRotatorErrorFallback from "@players/players-rating-rotator/components/error/players-rating-rotator-error-fallback";
import PlayersRatingRotatorSkeleton from "@players/players-rating-rotator/components/skeleton/players-rating-rotator-skeleton";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof LoginPage> = {
  title: "Auth/LoginPage",
  component: LoginPage,

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
        <HelmetProvider>
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
        </HelmetProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof LoginPage>;

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
