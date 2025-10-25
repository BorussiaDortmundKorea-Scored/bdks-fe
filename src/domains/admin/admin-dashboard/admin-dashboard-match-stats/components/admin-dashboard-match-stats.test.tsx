/**
 * 작성자: KYD
 * 기능: 경기별 평점 통계 차트 컴포넌트 테스트
 */
import AdminDashboardMatchStats from "./admin-dashboard-match-stats";
import AdminDashboardMatchStatsError from "./error/admin-dashboard-match-stats-error";
import AdminDashboardMatchStatsSkeleton from "./skeleton/admin-dashboard-match-stats-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<AdminDashboardMatchStatsSkeleton />} errorFallback={AdminDashboardMatchStatsError}>
        <AdminDashboardMatchStats />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("경기별 평점 통계 차트 컴포넌트 렌더링 테스트", () => {
  // Canvas mock 설정
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

  it("API 호출 전에는 로딩 컴포넌트가 나와야하고, 성공 시 차트가 렌더링되어야한다", async () => {
    renderWithQueryClient();

    // 로딩 상태 확인
    const loading = await screen.findByTestId("admin-dashboard-match-stats-skeleton");
    expect(loading).toBeInTheDocument();

    // 로딩 완료 후 차트 렌더링 확인
    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-match-stats-skeleton")).not.toBeInTheDocument();
    });

    // Canvas 요소가 렌더링되었는지 확인
    const canvas = screen.getByRole("img");
    expect(canvas).toBeInTheDocument();
  });

  it("API 호출 실패 시 에러 컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_match_rating_stats", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient();

    const errorElement = await screen.findByText("데이터를 불러올 수 없습니다");
    expect(errorElement).toBeInTheDocument();
  });
});
