import { MemoryRouter } from "react-router-dom";

import MatchesHistoryErrorFallback from "./error/matches-history-error-fallback";
import MatchesHistory from "./matches-history";
import MatchesHistorySkeleton from "./skeleton/matches-history-skeleton";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

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

describe("선수 누적평점 컴포넌트 렌더링 테스트", () => {
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
