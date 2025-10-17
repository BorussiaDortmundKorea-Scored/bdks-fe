// import { MemoryRouter } from "react-router-dom";
import MatchesLastestPlayerRatingErrorFallback from "./error/matches-lastest-player-rating-error-fallback";
import MatchesLastestPlayerRating from "./matches-lastest-player-rating";
import MatchesLastestPlayerRatingSkeleton from "./skeleton/matches-lastest-player-rating-skeleton";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpResponse, http } from "msw";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesLastestPlayerRating> = {
  title: "Matches/MatchesLastestPlayerRating",
  component: MatchesLastestPlayerRating,
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

type Story = StoryObj<typeof MatchesLastestPlayerRating>;

// 기본 스토리 - 정상적인 선수 정보와 평점 입력
export const Iphone5: Story = {
  globals: {
    viewport: { value: "iphone5", isRotated: false },
  },
};

// 로딩 상태
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", async () => {
          console.log("MSW: 로딩 상태 시뮬레이션");
          await new Promise((resolve) => setTimeout(resolve, 999999)); // 무한 로딩
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// 에러 상태
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          console.log("MSW: 에러 상태 시뮬레이션");
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};

// 높은 평점을 받은 선수
export const HighRatedPlayer: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          return HttpResponse.json({
            korean_name: "손흥민",
            full_profile_image_url:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
            position_detail_name: "공격수",
            line_number: 7,
            avg_rating: 9.2,
            rating_count: 2847,
            lineup_type: "STARTING",
            player_id: "player-456",
            match_id: "match-789",
            round_name: "1라운드",
            league_name: "K리그1",
            season: "2024",
            opponent_team_name: "서울 FC",
            goals: 3,
            assists: 2,
            match_start_time: new Date("2024-01-15T19:00:00Z"),
            first_half_end_time: new Date("2024-01-15T19:45:00Z"),
            second_half_start_time: new Date("2024-01-15T20:00:00Z"),
            second_half_end_time: new Date("2024-01-15T20:45:00Z"),
          });
        }),
        http.post("*/rest/v1/rpc/insert_player_rating", async ({ request }) => {
          const body = (await request.json()) as any;
          return HttpResponse.json({
            id: "rating-999",
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

// 낮은 평점을 받은 선수
export const LowRatedPlayer: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          return HttpResponse.json({
            korean_name: "김철수",
            full_profile_image_url:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
            position_detail_name: "수비수",
            line_number: 4,
            avg_rating: 4.1,
            rating_count: 89,
            lineup_type: "STARTING",
            player_id: "player-789",
            match_id: "match-123",
            round_name: "1라운드",
            league_name: "K리그1",
            season: "2024",
            opponent_team_name: "전북 현대",
            goals: 0,
            assists: 0,
            match_start_time: new Date("2024-01-15T19:00:00Z"),
            first_half_end_time: new Date("2024-01-15T19:45:00Z"),
            second_half_start_time: new Date("2024-01-15T20:00:00Z"),
            second_half_end_time: new Date("2024-01-15T20:45:00Z"),
          });
        }),
        http.post("*/rest/v1/rpc/insert_player_rating", async ({ request }) => {
          const body = (await request.json()) as any;
          return HttpResponse.json({
            id: "rating-111",
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

// 평점 입력 중 상태
export const SubmittingRating: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          return HttpResponse.json({
            korean_name: "박민수",
            full_profile_image_url:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            position_detail_name: "미드필더",
            line_number: 8,
            avg_rating: 6.8,
            rating_count: 156,
            lineup_type: "STARTING",
            player_id: "player-555",
            match_id: "match-666",
            round_name: "1라운드",
            league_name: "K리그1",
            season: "2024",
            opponent_team_name: "인천 유나이티드",
            goals: 1,
            assists: 1,
            match_start_time: new Date("2024-01-15T19:00:00Z"),
            first_half_end_time: new Date("2024-01-15T19:45:00Z"),
            second_half_start_time: new Date("2024-01-15T20:00:00Z"),
            second_half_end_time: new Date("2024-01-15T20:45:00Z"),
          });
        }),
        http.post("*/rest/v1/rpc/insert_player_rating", async () => {
          console.log("MSW: 평점 입력 지연 시뮬레이션");
          await new Promise((resolve) => setTimeout(resolve, 999999)); // 무한 로딩
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// 평점 입력 실패 (중복 입력)
export const RatingDuplicateError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_match_single_player_rating", () => {
          return HttpResponse.json({
            korean_name: "이영호",
            full_profile_image_url:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
            position_detail_name: "공격수",
            line_number: 10,
            avg_rating: 6.5,
            rating_count: 78,
            lineup_type: "STARTING",
            player_id: "player-888",
            match_id: "match-999",
            round_name: "1라운드",
            league_name: "K리그1",
            season: "2024",
            opponent_team_name: "수원 삼성",
            goals: 1,
            assists: 0,
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
