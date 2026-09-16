import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import { AuthContext } from "@auth/contexts/AuthContext";

import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayerRatingByMatchDetailChart from "@players/players-stats/players-stats-by-game/components/player-rating-by-match-detail-chart";
import PlayerRatingByMatchDetailChartSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/player-rating-by-match-detail-chart-skeleton";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof PlayerRatingByMatchDetailChart> = {
  title: "Players/PlayersStats/PlayerRatingByMatchDetailChart",
  component: PlayerRatingByMatchDetailChart,
  args: {
    matchId: "match-001",
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
      // 차트가 useAuth 로 user.id 를 읽으므로 Provider 없이는 렌더 전에 throw 된다
      return (
        <AuthContext.Provider value={storybookKakaoAuthMock}>
          <QueryClientProvider client={queryClient}>
            <ReactQueryBoundary
              skeleton={<PlayerRatingByMatchDetailChartSkeleton />}
              errorFallback={PlayersStatsByGameError}
            >
              {/* 실제 화면에서는 어두운 카드 안에 들어가므로 같은 배경을 깔아준다 */}
              <div className="bg-background-primary px-4 py-6">
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

type Story = StoryObj<typeof PlayerRatingByMatchDetailChart>;

export const Default: Story = {};

/**
 * 실제 데이터의 92% 가 이 모양이다 — 한 사람이 한 시점에만 평점을 남긴 경우.
 * 점이 하나뿐이면 이을 선이 없어, 마커를 켜지 않으면 화면에 아무것도 그려지지 않는다.
 */
export const SingleRating: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
          return HttpResponse.json({
            my_ratings: [{ minute: "후반 10'", avg_rating: 8.0, rating_count: 1 }],
            other_ratings: [
              { minute: "전반 15'", avg_rating: 6.5, rating_count: 10 },
              { minute: "후반 10'", avg_rating: 7.2, rating_count: 9 },
            ],
          });
        }),
      ],
    },
  },
};

export const NoData: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
          return HttpResponse.json({ my_ratings: [], other_ratings: [] });
        }),
      ],
    },
  },
};

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", async () => {
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
        http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
