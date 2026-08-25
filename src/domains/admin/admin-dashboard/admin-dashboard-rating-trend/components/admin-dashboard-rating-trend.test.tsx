/**
 * 작성자: KYD
 * 기능: 평점 활동 추이 카드 컴포넌트 테스트
 */
import AdminDashboardRatingTrend from "./admin-dashboard-rating-trend";
import AdminDashboardRatingTrendError from "./error/admin-dashboard-rating-trend-error";
import AdminDashboardRatingTrendSkeleton from "./skeleton/admin-dashboard-rating-trend-skeleton";
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
      <ReactQueryBoundary
        skeleton={<AdminDashboardRatingTrendSkeleton />}
        errorFallback={AdminDashboardRatingTrendError}
      >
        <AdminDashboardRatingTrend />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("평점 활동 추이 카드 컴포넌트 렌더링 테스트", () => {
  // Canvas mock 설정 (chart.js 라인 스파크라인 렌더링용)
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

  it("API 호출 전에는 로딩 컴포넌트가 나와야하고, 성공 시 카드와 스파크라인이 렌더링되어야한다", async () => {
    renderWithQueryClient();

    // 로딩 상태 확인
    const loading = await screen.findByTestId("admin-dashboard-rating-trend-skeleton");
    expect(loading).toBeInTheDocument();

    // 로딩 완료 후 카드 렌더링 확인
    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-rating-trend-skeleton")).not.toBeInTheDocument();
    });

    // 공통 타이틀 및 두 페이지의 축약 라벨, 스파크라인(canvas) 렌더링 확인
    expect(screen.getByText("평점 활동 추이")).toBeInTheDocument();
    expect(screen.getByText("이번 달")).toBeInTheDocument();
    expect(screen.getByText("최근 경기")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(1);
  });

  it("API 호출 실패 시 에러 컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_monthly_rating_trend", () => {
        return HttpResponse.error();
      }),
      http.post("*/rest/v1/rpc/get_match_participation_trend", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient();

    const errorElement = await screen.findByText("데이터를 불러올 수 없습니다");
    expect(errorElement).toBeInTheDocument();
  });
});
