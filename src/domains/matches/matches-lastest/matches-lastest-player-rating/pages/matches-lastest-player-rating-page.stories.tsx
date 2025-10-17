import MatchesLastestPlayerRatingErrorFallback from "../components/error/matches-lastest-player-rating-error-fallback";
import MatchesLastestPlayerRatingSkeleton from "../components/skeleton/matches-lastest-player-rating-skeleton";
import MatchesLastestPlayerRatingPage from "./matches-lastest-player-rating-page";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";
import { reactRouterParameters, withRouter } from "storybook-addon-remix-react-router";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesLastestPlayerRatingPage> = {
  title: "Matches/MatchesLastestPlayerRatingPage",
  component: MatchesLastestPlayerRatingPage,
  decorators: [
    withRouter,
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
          <ReactQueryBoundary
            skeleton={<MatchesLastestPlayerRatingSkeleton />}
            errorFallback={MatchesLastestPlayerRatingErrorFallback}
          >
            <Story />
          </ReactQueryBoundary>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesLastestPlayerRatingPage>;

// 기본 스토리
export const Default: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
  },
};

// 모바일 뷰포트 스토리들
export const Iphone5: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    viewport: { value: "iphone5", isRotated: false },
  },
};

export const Iphone12: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    viewport: { value: "iphone12", isRotated: false },
  },
};

export const GalaxyS24: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    viewport: { value: "GalaxyS24", isRotated: false },
  },
};

export const GalaxyS24Plus: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    viewport: { value: "GalaxyS24Plus", isRotated: false },
  },
};

// 로딩 상태: MSW에서 지연시간 추가
export const Loading: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    msw: {
      handlers: [
        // 글로벌 핸들러를 덮어쓰기 위해 더 구체적인 패턴 사용
        http.post("*/rest/v1/rpc/get_match_single_player_rating", async () => {
          console.log("MSW: 로딩 상태 시뮬레이션");
          await new Promise((resolve) => setTimeout(resolve, 999999)); // 무한 로딩
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// 에러 상태: MSW에서 에러 응답
export const Error: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    msw: {
      handlers: [
        // 글로벌 핸들러를 덮어쓰기 위해 더 구체적인 패턴 사용
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          console.log("MSW: 에러 상태 시뮬레이션");
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

// 평점 입력 성공 시뮬레이션
export const RatingSuccess: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          console.log("MSW: 선수 정보 조회 성공");
          return HttpResponse.json({
            korean_name: "김영덕",
            full_profile_image_url:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            position_detail_name: "공격수",
            line_number: 9,
            avg_rating: 7.5,
            rating_count: 124,
            lineup_type: "STARTING",
            player_id: "player-123",
            match_id: "match-456",
            round_name: "1라운드",
            league_name: "K리그1",
            season: "2024",
            opponent_team_name: "울산 현대",
            goals: 2,
            assists: 1,
            match_start_time: new Date("2024-01-15T19:00:00Z"),
            first_half_end_time: new Date("2024-01-15T19:45:00Z"),
            second_half_start_time: new Date("2024-01-15T20:00:00Z"),
            second_half_end_time: new Date("2024-01-15T20:45:00Z"),
          });
        }),
        http.post("*/rest/v1/rpc/insert_player_rating", async ({ request }) => {
          console.log("MSW: 평점 입력 성공 시뮬레이션");
          const body = (await request.json()) as any;
          console.log("MSW: 평점 입력 요청:", body);

          // 성공 응답
          return HttpResponse.json({
            id: "rating-789",
            rating: body.p_rating,
            minute: body.p_minute,
            user_nickname: "보돌코스코어드",
            success: true,
            message: "평점이 성공적으로 입력되었습니다.",
          });
        }),
      ],
    },
  },
};

// 평점 입력 실패 시뮬레이션 (중복 입력)
export const RatingDuplicateError: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { matchId: "match-456", playerId: "player-123" },
      },
      routing: { path: "/matches/lastest/player-rating/:matchId/:playerId" },
    }),
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          return HttpResponse.json({
            korean_name: "김영덕",
            full_profile_image_url:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            position_detail_name: "공격수",
            line_number: 9,
            avg_rating: 7.5,
            rating_count: 124,
            lineup_type: "STARTING",
            player_id: "player-123",
            match_id: "match-456",
            round_name: "1라운드",
            league_name: "K리그1",
            season: "2024",
            opponent_team_name: "울산 현대",
            goals: 2,
            assists: 1,
            match_start_time: new Date("2024-01-15T19:00:00Z"),
            first_half_end_time: new Date("2024-01-15T19:45:00Z"),
            second_half_start_time: new Date("2024-01-15T20:00:00Z"),
            second_half_end_time: new Date("2024-01-15T20:45:00Z"),
          });
        }),
        http.post("*/rest/v1/rpc/insert_player_rating", () => {
          console.log("MSW: 중복 평점 입력 에러 시뮬레이션");
          return new HttpResponse(null, {
            status: 400,
            statusText: "Bad Request",
          });
        }),
      ],
    },
  },
};
