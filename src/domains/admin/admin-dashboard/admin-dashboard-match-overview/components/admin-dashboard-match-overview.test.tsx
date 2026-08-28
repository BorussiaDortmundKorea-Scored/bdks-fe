/**
 * 작성자: KYD
 * 기능: 경기 평점 현황 통합 PagedCard 렌더링 테스트
 */
import AdminDashboardMatchOverview from "./admin-dashboard-match-overview";
import AdminDashboardMatchOverviewError from "./error/admin-dashboard-match-overview-error";
import AdminDashboardMatchOverviewSkeleton from "./skeleton/admin-dashboard-match-overview-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderOverview = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AdminDashboardMatchOverviewSkeleton />}
        errorFallback={AdminDashboardMatchOverviewError}
      >
        <AdminDashboardMatchOverview />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("경기 평점 현황 통합 카드 렌더링 테스트", () => {
  beforeAll(() => {
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
      transform: vi.fn(),
      rect: vi.fn(),
      clip: vi.fn(),
    })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  it("로딩 후 통합 헤더와 두 페이지(참여율/입력현황) dot 페이저가 렌더링된다", async () => {
    renderOverview();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-match-overview-skeleton")).not.toBeInTheDocument();
    });

    // 단일 헤더(제목 + 현재 페이지 서브타이틀) + 페이지 2개 → dot 2개
    expect(screen.getByText("경기별 평점")).toBeInTheDocument();
    expect(screen.getByText("참여율")).toBeInTheDocument(); // 초기 페이지(참여율) 서브타이틀
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_match_overview", () => {
        return HttpResponse.error();
      }),
    );

    renderOverview();

    const errorEl = await screen.findByTestId("admin-dashboard-match-overview-error");
    expect(errorEl).toBeInTheDocument();
  });
});
