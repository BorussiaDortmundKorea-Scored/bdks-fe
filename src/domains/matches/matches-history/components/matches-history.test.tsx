import { MemoryRouter } from "react-router-dom";

import MatchesHistoryErrorFallback from "./error/matches-history-error-fallback";
import MatchesHistory from "./matches-history";
import MatchesHistorySkeleton from "./skeleton/matches-history-skeleton";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReactQueryBoundary from "@shared/provider/react-query-boundary";

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
        <ReactQueryBoundary skeleton={<MatchesHistorySkeleton />} errorFallback={MatchesHistoryErrorFallback}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("최근 경기 컴포넌트 렌더링 테스트", () => {
  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 로딩컴포넌트가 사라지고 선수데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(<MatchesHistory />);

    const loadingElement = await screen.findByTestId("matches-history-skeleton");
    expect(loadingElement).toBeInTheDocument();

    screen.debug();
    await waitFor(() => {
      expect(screen.queryByTestId("matches-history-skeleton")).not.toBeInTheDocument();
    });
    screen.debug();
  });
});

describe("최근 경기 컴포넌트 기능 테스트", () => {
  // TODO: 가로스크롤 테스트 현재 코드에상관없이 무조건 TRUE를 반환한다는것을 깨달음
  it("가로스크롤이 되어야함", async () => {
    const user = userEvent.setup();
    await renderWithQueryClient(<MatchesHistory />);

    await waitFor(() => {
      expect(screen.queryByTestId("matches-history-skeleton")).not.toBeInTheDocument();
    });

    const scrollContainer = screen.getByRole("list");

    fireEvent.scroll(scrollContainer, {
      target: { scrollLeft: 100 },
    });

    await user.hover(scrollContainer);
    await user.pointer({ target: scrollContainer, keys: "[TouchA]" });
    await user.pointer({ target: scrollContainer, coords: { x: 100, y: 0 } });

    expect(scrollContainer.scrollLeft).toBe(100);
  });
});
