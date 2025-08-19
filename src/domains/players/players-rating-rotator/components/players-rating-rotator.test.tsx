// src/shared/components/player-rating-rotator.test.tsx
import { MemoryRouter } from "react-router-dom";

import PlayerRatingRotatorErrorFallback from "./error/players-rating-rotator-error-fallback";
import PlayersRatingRotatorSkeleton from "./skeleton/players-rating-rotator-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import PlayersRatingRotator from "@players/players-rating-rotator/components/players-rating-rotator";

describe("PlayerRatingRotator 컴포넌트 렌더링 테스트", () => {
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
            skeleton={<PlayersRatingRotatorSkeleton />}
            errorFallback={PlayerRatingRotatorErrorFallback}
          >
            {component}
          </ReactQueryBoundary>
        </QueryClientProvider>
      </MemoryRouter>,
    );
  };

  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 로딩컴포넌트가 사라지고 선수데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(<PlayersRatingRotator />);

    // 로딩 상태 확인
    const loadingElement = await screen.findByTestId("players-rating-rotator-skeleton");
    expect(loadingElement).toBeInTheDocument();

    // 데이터 로딩 완료 대기
    await waitFor(() => {
      expect(screen.queryByTestId("players-rating-rotator-skeleton")).not.toBeInTheDocument();
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
});
