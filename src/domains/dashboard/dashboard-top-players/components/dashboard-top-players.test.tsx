/**
 * 작성자: KYD
 * 기능: TOP PLAYERS(선수 기록 리더) 컴포넌트 렌더링 테스트
 */
import { MemoryRouter } from "react-router-dom";

import DashboardTopPlayers from "./dashboard-top-players";
import DashboardTopPlayersErrorFallback from "./error/dashboard-top-players-error-fallback";
import DashboardTopPlayersSkeleton from "./skeleton/dashboard-top-players-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderTopPlayers = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ReactQueryBoundary skeleton={<DashboardTopPlayersSkeleton />} errorFallback={DashboardTopPlayersErrorFallback}>
          <DashboardTopPlayers />
        </ReactQueryBoundary>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("TOP PLAYERS 컴포넌트 렌더링 테스트", () => {
  it("로딩 후 4가지 기록 카드(라벨·선수명)가 렌더링된다", async () => {
    renderTopPlayers();

    await waitFor(() => {
      expect(screen.queryByTestId("dashboard-top-players-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("TOP PLAYERS")).toBeInTheDocument();
    expect(screen.getByText("단일 경기 최고 평점")).toBeInTheDocument();
    expect(screen.getByText("이번 시즌 최다 골")).toBeInTheDocument();
    expect(screen.getByText("율리안")).toBeInTheDocument();
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_dashboard_record_leaders", () => {
        return HttpResponse.error();
      }),
    );

    renderTopPlayers();

    const errorEl = await screen.findByTestId("dashboard-top-players-error");
    expect(errorEl).toBeInTheDocument();
  });
});
