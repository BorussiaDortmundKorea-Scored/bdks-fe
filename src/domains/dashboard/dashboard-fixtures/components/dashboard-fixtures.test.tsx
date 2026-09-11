/**
 * 작성자: KYD
 * 기능: 경기 일정 위젯 렌더링 테스트
 */
import { MemoryRouter } from "react-router-dom";

import DashboardFixtures from "./dashboard-fixtures";
import DashboardFixturesErrorFallback from "./error/dashboard-fixtures-error-fallback";
import DashboardFixturesSkeleton from "./skeleton/dashboard-fixtures-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderFixtures = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryBoundary skeleton={<DashboardFixturesSkeleton />} errorFallback={DashboardFixturesErrorFallback}>
          <DashboardFixtures />
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("경기 일정 위젯 렌더링 테스트", () => {
  it("로딩 후 예정 경기 목록이 렌더링된다", async () => {
    renderFixtures();

    await waitFor(() => {
      expect(screen.queryByTestId("dashboard-fixtures-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("경기 일정")).toBeInTheDocument();
    // 더미 첫 경기 상대
    expect(screen.getByText(/우니온 베를린/)).toBeInTheDocument();
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_upcoming_matches", () => {
        return HttpResponse.error();
      }),
    );

    renderFixtures();

    expect(await screen.findByTestId("dashboard-fixtures-error")).toBeInTheDocument();
  });
});
