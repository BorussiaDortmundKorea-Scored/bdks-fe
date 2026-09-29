import MatchesHistoryPlayersRatingErrorFallback from "../components/error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRatingSkeleton from "../components/skeleton/matches-history-players-rating-skeleton";
import MatchesHistoryPlayersRatingPage from "./matches-history-players-rating-page";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HttpResponse, http } from "msw";
import { reactRouterParameters } from "storybook-addon-remix-react-router";

import { AuthContext } from "@auth/contexts/AuthContext";

import { storybookKakaoAuthMock } from "@shared/mocks/constants/storybook-auth-mock-data";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const meta: Meta<typeof MatchesHistoryPlayersRatingPage> = {
  title: "Matches/MatchesHistory/PlayersRatingPage",
  component: MatchesHistoryPlayersRatingPage,
  // 페이지가 useParams 로 matchId 를 읽으므로 경로를 지정해 준다 (라우터 자체는 preview 의 전역 데코레이터)
  parameters: {
    reactRouter: reactRouterParameters({
      location: { pathParams: { matchId: "match-456" } },
      routing: { path: "/match/:matchId/ratings" },
    }),
  },
  decorators: [
    (Story) => (
      <AuthContext.Provider value={storybookKakaoAuthMock}>
        <ReactQueryBoundary
          skeleton={<MatchesHistoryPlayersRatingSkeleton />}
          errorFallback={MatchesHistoryPlayersRatingErrorFallback}
        >
          <Story />
        </ReactQueryBoundary>
      </AuthContext.Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MatchesHistoryPlayersRatingPage>;

export const Iphone5: Story = {
  globals: { viewport: { value: "iphone5", isRotated: false } },
};

export const Iphone12: Story = {
  globals: { viewport: { value: "iphone12", isRotated: false } },
};

export const GalaxyS24: Story = {
  globals: { viewport: { value: "GalaxyS24", isRotated: false } },
};

export const GalaxyS24Plus: Story = {
  globals: { viewport: { value: "GalaxyS24Plus", isRotated: false } },
};

// 로딩 상태: MSW에서 지연시간 추가
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_matches_player_ratings", async () => {
          await new Promise((resolve) => setTimeout(resolve, 999999));
          return HttpResponse.json({});
        }),
        http.post("*/rest/v1/rpc/get_match_info", async () => {
          await new Promise((resolve) => setTimeout(resolve, 999999));
          return HttpResponse.json({});
        }),
      ],
    },
  },
};

// 에러 상태: MSW에서 에러 응답
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post("*/rest/v1/rpc/get_matches_player_ratings", () => {
          return new HttpResponse(null, { status: 500 });
        }),
        http.post("*/rest/v1/rpc/get_match_info", () => {
          return new HttpResponse(null, { status: 500 });
        }),
      ],
    },
  },
};
