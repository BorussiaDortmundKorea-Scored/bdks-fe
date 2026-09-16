/**
 * 작성자: KYD
 * 기능: 평점 분포 PagedCard 렌더링 테스트
 */
import AdminDashboardRatingDistribution from "./admin-dashboard-rating-distribution";
import AdminDashboardRatingDistributionError from "./error/admin-dashboard-rating-distribution-error";
import AdminDashboardRatingDistributionSkeleton from "./skeleton/admin-dashboard-rating-distribution-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderRatingDistribution = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AdminDashboardRatingDistributionSkeleton />}
        errorFallback={AdminDashboardRatingDistributionError}
      >
        <AdminDashboardRatingDistribution />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("평점 분포 PagedCard 렌더링 테스트", () => {
  it("로딩 후 두 페이지의 요약과 dot 페이저가 렌더링된다", async () => {
    renderRatingDistribution();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-rating-distribution-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("평점 분포")).toBeInTheDocument();
    expect(screen.getByText("경기 시간별")).toBeInTheDocument();
    expect(screen.getByText("점수대별 · 평균 6.27점 / 총 1,042건")).toBeInTheDocument();
    // 경기 시간 / 점수대 2페이지 → dot 2개
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    // 경기 시간별이 첫 페이지여야 한다 (DOM 순서 = 페이지 순서)
    const phaseLabel = screen.getByText("경기 시간별");
    const scoreLabel = screen.getByText(/^점수대별/);
    expect(phaseLabel.compareDocumentPosition(scoreLabel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("평점이 한 건도 없으면 안내 문구를 노출한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_rating_stats", () => {
        return HttpResponse.json({
          total_rating_count: 0,
          average_rating: 0,
          distribution: [],
          phase: [],
        });
      }),
    );

    renderRatingDistribution();

    // 두 페이지 모두 같은 안내 문구를 쓴다 (offscreen 페이지 포함)
    expect((await screen.findAllByText("입력된 평점이 없습니다.")).length).toBeGreaterThanOrEqual(1);
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_rating_stats", () => {
        return HttpResponse.error();
      }),
    );

    renderRatingDistribution();

    expect(await screen.findByTestId("admin-dashboard-rating-distribution-error")).toBeInTheDocument();
  });
});
