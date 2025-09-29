import { MemoryRouter, Route, Routes } from "react-router-dom";

import MatchesHistoryPlayersRatingErrorFallback from "./error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRating from "./matches-history-players-rating";
import MatchesHistoryPlayersRatingSkeleton from "./skeleton/matches-history-players-rating-skeleton";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = (initialEntries: string[]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryBoundary
          skeleton={<MatchesHistoryPlayersRatingSkeleton />}
          errorFallback={MatchesHistoryPlayersRatingErrorFallback}
        >
          <Routes>
            <Route path="/matches/:matchId/players-rating" element={<MatchesHistoryPlayersRating />} />
          </Routes>
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("경기-선수 평점 컴포넌트 렌더링 테스트", () => {
  it("API호출 전에는 로딩컴포넌트가 나와야하고, 성공시 선수데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(["/matches/123/players-rating"]);

    const loading = await screen.findByTestId("matches-history-players-rating-skeleton");
    expect(loading).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("matches-history-players-rating-skeleton")).not.toBeInTheDocument();
    });

    const firstPlayer = await screen.findByText("그레고르 코벨");
    expect(firstPlayer).toBeInTheDocument();
  });

  it("API호출 실패시 에러컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_matches_player_ratings", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient(["/matches/123/players-rating"]);
    const errorElement = await screen.findByTestId("matches-history-players-rating-error-fallback");
    expect(errorElement).toBeInTheDocument();
  });
});
