import { MemoryRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import { getAnonymousUserAuthMock } from "@shared/mocks/constants/user-mock-data";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import PlayerRatingByMatchDetailChart from "@players/players-stats/players-stats-by-game/components/player-rating-by-match-detail-chart";
import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayerRatingByMatchDetailChartSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/player-rating-by-match-detail-chart-skeleton";

const mockUseAuth = vi.fn();

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryBoundary
          skeleton={<PlayerRatingByMatchDetailChartSkeleton />}
          errorFallback={PlayersStatsByGameError}
        >
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("경기별 선수 평점 차트 컴포넌트 렌더링 테스트", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue(getAnonymousUserAuthMock());
  });

  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 차트가 렌더링되어야한다", async () => {
    renderWithQueryClient(<PlayerRatingByMatchDetailChart matchId="match-001" playerId="player-123" />);

    const loadingElement = await screen.findByTestId("player-rating-by-match-detail-chart-skeleton");
    expect(loadingElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("player-rating-by-match-detail-chart-skeleton")).not.toBeInTheDocument();
    });
  });

  it("평점 데이터가 없을 경우 안내 메시지가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_player_rating_by_match_detail", () => {
        return HttpResponse.json({ my_ratings: [], other_ratings: [] });
      }),
    );

    renderWithQueryClient(<PlayerRatingByMatchDetailChart matchId="match-001" playerId="player-123" />);

    await waitFor(() => {
      expect(screen.queryByTestId("player-rating-by-match-detail-chart-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("평점 데이터가 없습니다.")).toBeInTheDocument();
  });
});
