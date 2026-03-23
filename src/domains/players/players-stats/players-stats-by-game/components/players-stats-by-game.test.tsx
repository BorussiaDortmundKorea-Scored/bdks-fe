import { MemoryRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import PlayersStatsByGame from "@players/players-stats/players-stats-by-game/components/players-stats-by-game";
import PlayersStatsByGameError from "@players/players-stats/players-stats-by-game/components/error/players-stats-by-game-error";
import PlayersStatsByGameSkeleton from "@players/players-stats/players-stats-by-game/components/skeleton/players-stats-by-game-skeleton";

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
        <ReactQueryBoundary skeleton={<PlayersStatsByGameSkeleton />} errorFallback={PlayersStatsByGameError}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("선수별 경기 통계 컴포넌트 렌더링 테스트", () => {
  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(<PlayersStatsByGame playerId="player-123" />);

    const loadingElement = await screen.findByTestId("players-stats-by-game-skeleton");
    expect(loadingElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("players-stats-by-game-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getAllByText("바이에른 뮌헨").length).toBeGreaterThan(0);
  });

  it("API호출 실패시 에러컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_player_stats_by_game", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient(<PlayersStatsByGame playerId="player-123" />);
    const errorElement = await screen.findByTestId("players-stats-by-game-error");
    expect(errorElement).toBeInTheDocument();
  });
});
