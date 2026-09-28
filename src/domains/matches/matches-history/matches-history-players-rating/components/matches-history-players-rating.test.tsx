import { MemoryRouter, Route, Routes } from "react-router-dom";

import MatchesHistoryPlayersRatingErrorFallback from "./error/matches-history-players-rating-error-fallback";
import MatchesHistoryPlayersRating from "./matches-history-players-rating";
import MatchesHistoryPlayersRatingSkeleton from "./skeleton/matches-history-players-rating-skeleton";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
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

    // 포메이션은 이름 대신 얼굴로 그려지므로 이미지의 alt 로 확인한다.
    // 사이드 패널에도 최고 평점 선수의 얼굴이 있어 포메이션 영역 안에서만 센다.
    const formation = await screen.findByRole("region", { name: "포메이션" });
    expect(within(formation).getByAltText("그레고르 코벨")).toBeInTheDocument();

    // 그라운드에 있던 11명만 선발 화면에 나온다 (더미 13명 중 2명은 교체 아웃/미출전)
    const playerImages = within(formation)
      .getAllByRole("img")
      .filter((image) => image.getAttribute("alt") !== "yellow wall");
    expect(playerImages).toHaveLength(11);
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
