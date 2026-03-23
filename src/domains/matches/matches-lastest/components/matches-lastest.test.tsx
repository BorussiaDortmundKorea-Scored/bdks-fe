import { MemoryRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

import MatchesLastestErrorFallback from "@matches/matches-lastest/components/error/matches-lastest-error-fallback";
import MatchesLastest from "@matches/matches-lastest/components/matches-lastest";
import MatchesLastestSkeleton from "@matches/matches-lastest/components/skeleton/matches-lastest-skeleton";

vi.mock("@shared/api/config/supabaseClient", () => ({
  supabase: {
    rpc: vi.fn().mockImplementation((functionName: string) => {
      return fetch(`https://dummy.supabase.co/rest/v1/rpc/${functionName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => ({ data, error: null }));
    }),
    channel: () => ({
      on: () => ({
        on: () => ({
          subscribe: () => ({}),
        }),
      }),
      subscribe: () => ({}),
    }),
    removeChannel: () => {},
  },
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
        <ReactQueryBoundary skeleton={<MatchesLastestSkeleton />} errorFallback={MatchesLastestErrorFallback}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("최근 경기 포메이션 컴포넌트 렌더링 테스트", () => {
  it("API호출 전에는 로딩컴포넌트가 나와야한다. 호출 성공시 데이터가 렌더링되어야한다", async () => {
    renderWithQueryClient(<MatchesLastest />);

    const loadingElement = await screen.findByTestId("matches-lastest-skeleton");
    expect(loadingElement).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("matches-lastest-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText(/바이에른 뮌헨/)).toBeInTheDocument();
  });

  it("API호출 실패시 에러컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_latest_match_live_formation", () => {
        return HttpResponse.error();
      }),
      http.post("*/rest/v1/rpc/get_latest_match_information", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient(<MatchesLastest />);
    const errorElement = await screen.findByTestId("matches-lastest-error-fallback");
    expect(errorElement).toBeInTheDocument();
  });
});
