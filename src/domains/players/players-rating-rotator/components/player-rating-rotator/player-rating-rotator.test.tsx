// src/shared/components/player-rating-rotator.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import PlayerRatingRotator from "@players/players-rating-rotator/components/player-rating-rotator/player-rating-rotator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import AnimalListError from "@animals/components/animal-list/error/animal-list-error";
import { server } from "@shared/mocks/server";
import { http, HttpResponse } from "msw";

describe("PlayerRatingRotator 컴포넌트 테스트", () => {
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
          <ReactQueryBoundary skeleton={<div>Loading...</div>} errorFallback={AnimalListError}>
            {component}
          </ReactQueryBoundary>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  it("should render with MSW debugging", async () => {
    renderWithQueryClient(<PlayerRatingRotator />);

    // 로딩 상태 확인
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // 실제 데이터가 표시되는지 확인 (중복된 요소가 있으므로 getAllByText 사용)
    await waitFor(() => {
      const testPlayers = screen.getAllByText("그레고어 코벨");
      expect(testPlayers.length).toBe(2);

      const ratings = screen.getAllByText("7.6");
      expect(ratings.length).toBe(2);
    });

    // 디버깅을 위한 스크린 출력
    screen.debug();
  });

  it("should handle empty data gracefully", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_player_rating_rotator_acc", () => {
        console.log("빈 데이터 반환");
        return HttpResponse.json([]);
      }),
    );

    renderWithQueryClient(<PlayerRatingRotator />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // 빈 데이터일 때도 컴포넌트가 렌더링되는지 확인
    const containers = screen.getAllByRole("generic");
    expect(containers.length).toBeGreaterThan(0);

    // 빈 데이터일 때는 선수 이름이 표시되지 않아야 함
    expect(screen.queryByText("테스트 선수")).not.toBeInTheDocument();
  });
});
