import UserRankingErrorFallback from "./error/user-ranking-error-fallback";
import UserRankingSkeleton from "./skeleton/user-ranking-skeleton";
import UserRanking from "./user-ranking";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof UserRanking> = {
  title: "Auth/AuthInfo/UserRanking",
  component: UserRanking,
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
          <ReactQueryBoundary skeleton={<UserRankingSkeleton />} errorFallback={UserRankingErrorFallback}>
            <div className="bdks-container bg-background-primary px-4 py-6">
              <Story />
            </div>
          </ReactQueryBoundary>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof UserRanking>;

export const Default: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};

export const WithLongNicknames: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_user_rating_ranking", () => {
          return HttpResponse.json([
            {
              rank: 1,
              user_id: "11111111-1111-1111-1111-111111111111",
              nickname: "보루시아도르트문트팬",
              favorite_player_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/players/head/head_brandt.png",
              rating_count: 120,
            },
            {
              rank: 2,
              user_id: "22222222-2222-2222-2222-222222222222",
              nickname: "축구를사랑하는사람",
              favorite_player_image_url: null,
              rating_count: 85,
            },
            {
              rank: 3,
              user_id: "33333333-3333-3333-3333-333333333333",
              nickname: "하이바이마마마마",
              favorite_player_image_url: null,
              rating_count: 42,
            },
          ]);
        }),
        http.post("*/rest/v1/rpc/get_user_viewing_ranking", () => {
          return HttpResponse.json([
            {
              rank: 1,
              user_id: "11111111-1111-1111-1111-111111111111",
              nickname: "보루시아도르트문트팬",
              favorite_player_image_url:
                "https://abxgeyabzwzrorecsjcd.supabase.co/storage/v1/object/public/players/head/head_brandt.png",
              viewing_count: 15,
            },
            {
              rank: 2,
              user_id: "22222222-2222-2222-2222-222222222222",
              nickname: "축구를사랑하는사람",
              favorite_player_image_url: null,
              viewing_count: 10,
            },
            {
              rank: 3,
              user_id: "33333333-3333-3333-3333-333333333333",
              nickname: "하이바이마마마마",
              favorite_player_image_url: null,
              viewing_count: 7,
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

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_user_rating_ranking", () => {
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
  render: () => <UserRankingSkeleton />,
  parameters: {
    viewport: {
      defaultViewport: "iphone5",
    },
  },
};
