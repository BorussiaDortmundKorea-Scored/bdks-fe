/**
 * 작성자: KYD
 * 기능: 리그 순위(AdminStandings) 컴포넌트 렌더링 테스트
 */
import AdminStandings from "./admin-standings";
import AdminStandingsErrorFallback from "./error/admin-standings-error-fallback";
import AdminStandingsSkeleton from "./skeleton/admin-standings-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderStandings = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<AdminStandingsSkeleton />} errorFallback={AdminStandingsErrorFallback}>
        <AdminStandings />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("리그 순위 컴포넌트 렌더링 테스트", () => {
  it("로딩 후 순위표(헤더·두 페이지 dot·도르트문트 강조)가 렌더링된다", async () => {
    renderStandings();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-standings-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("이번 시즌 리그 순위")).toBeInTheDocument();
    // 분데스리가/챔피언스리그 2페이지 → dot(tab) 2개
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    // 순위 데이터(도르트문트) 렌더 확인 (offscreen 페이지 포함해 getAllByText)
    expect(screen.getAllByText("도르트문트").length).toBeGreaterThanOrEqual(1);
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_standings", () => {
        return HttpResponse.error();
      }),
    );

    renderStandings();

    const errorEl = await screen.findByTestId("admin-standings-error");
    expect(errorEl).toBeInTheDocument();
  });
});
