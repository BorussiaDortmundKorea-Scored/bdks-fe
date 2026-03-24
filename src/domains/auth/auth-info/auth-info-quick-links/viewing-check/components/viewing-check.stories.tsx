import ViewingCheckErrorFallback from "./error/viewing-check-error-fallback";
import ViewingCheckSkeleton from "./skeleton/viewing-check-skeleton";
import ViewingCheck from "./viewing-check";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import { AuthContext } from "@auth/contexts/AuthContext";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof ViewingCheck> = {
  title: "Auth/AuthInfo/ViewingCheck",
  component: ViewingCheck,
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
        <AuthContext.Provider value={storybookKakaoAuthMock}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary skeleton={<ViewingCheckSkeleton />} errorFallback={ViewingCheckErrorFallback}>
              <div className="bdks-container bg-background-primary px-4 py-6">
                <Story />
              </div>
            </ReactQueryBoundary>
          </QueryClientProvider>
        </AuthContext.Provider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof ViewingCheck>;

// 기본 스토리 - 과거/다가오는 경기가 함께 있는 경우
export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 다가오는 경기가 없는 경우
export const OnlyPastMatches: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_viewing_matches", () => {
          return HttpResponse.json([
            {
              id: "33333333-3333-3333-3333-333333333333",
              match_date: "2025-07-20",
              home_away: "HOME",
              round_name: "34R",
              competition_name: "분데스리가",
              season: "24-25",
              opponent_team_name: "FC 쾰른",
              opponent_team_logo_image_url: "https://example.com/logo-koeln.png",
              is_live: false,
              status: "PAST",
              has_viewing_check: true,
            },
          ]);
        }),
      ],
    },
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 지난 경기가 없는 경우
export const OnlyUpcomingMatches: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_viewing_matches", () => {
          return HttpResponse.json([
            {
              id: "55555555-5555-5555-5555-555555555555",
              match_date: "2025-09-01",
              home_away: "HOME",
              round_name: "1R",
              competition_name: "DFB 포칼",
              season: "25-26",
              opponent_team_name: "샬케 04",
              opponent_team_logo_image_url: "https://example.com/logo-schalke.png",
              is_live: false,
              status: "UPCOMING",
              has_viewing_check: false,
            },
          ]);
        }),
      ],
    },
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

// 에러 상태
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_viewing_matches", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

export const Loading: Story = {
  render: () => <ViewingCheckSkeleton />,
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};
