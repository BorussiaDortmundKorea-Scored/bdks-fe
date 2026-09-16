/**
 * 작성자: KYD
 * 기능: 경기별 유저 평점 입력 횟수 세부 차트 컴포넌트 테스트
 * 프로세스 설명: 요약 차트(AdminDashboardMatchStats)는 match-overview 로 통합되면서 사라졌고,
 *              세부 차트만 match-stats-view 를 통해 살아남아 이 파일이 그 부분만 검증한다.
 */
import AdminDashboardMatchStatsDetailChart from "./admin-dashboard-match-stats-detail-chart";
import AdminDashboardMatchStatsDetailError from "./error/admin-dashboard-match-stats-detail-error";
import AdminDashboardMatchStatsDetailSkeleton from "./skeleton/admin-dashboard-match-stats-detail-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const MATCH_ID = "550e8400-e29b-41d4-a716-446655440001";

const renderDetailChart = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AdminDashboardMatchStatsDetailSkeleton />}
        errorFallback={AdminDashboardMatchStatsDetailError}
      >
        <AdminDashboardMatchStatsDetailChart matchId={MATCH_ID} />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("경기별 유저 평점 입력 횟수 세부 차트 렌더링 테스트", () => {
  // jsdom 에는 canvas 구현이 없어 Chart.js 가 컨텍스트를 못 잡는다
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

  it("API 호출 전에는 로딩 컴포넌트가 나오고, 성공 시 차트가 렌더링된다", async () => {
    renderDetailChart();

    const loading = await screen.findByTestId("admin-dashboard-match-stats-detail-skeleton");
    expect(loading).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-match-stats-detail-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("API 호출 실패 시 에러 컴포넌트가 나온다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_match_user_rating_counts", () => {
        return HttpResponse.error();
      }),
    );

    renderDetailChart();

    expect(await screen.findByTestId("admin-dashboard-match-stats-detail-error")).toBeInTheDocument();
  });
});
