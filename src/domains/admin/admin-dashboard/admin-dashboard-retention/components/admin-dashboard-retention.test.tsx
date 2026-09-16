/**
 * 작성자: KYD
 * 기능: 회원 리텐션 퍼널 컴포넌트 렌더링 테스트
 */
import AdminDashboardRetention from "./admin-dashboard-retention";
import AdminDashboardRetentionError from "./error/admin-dashboard-retention-error";
import AdminDashboardRetentionSkeleton from "./skeleton/admin-dashboard-retention-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderRetention = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<AdminDashboardRetentionSkeleton />} errorFallback={AdminDashboardRetentionError}>
        <AdminDashboardRetention />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("회원 리텐션 퍼널 렌더링 테스트", () => {
  it("로딩 후 제목과 평균 참여율이 렌더링된다", async () => {
    renderRetention();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-retention-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("회원 리텐션")).toBeInTheDocument();
    expect(screen.getByText("평균 참여율 26.7%")).toBeInTheDocument();
    expect(screen.getByTestId("admin-dashboard-retention-chart")).toBeInTheDocument();
  });

  it("카드 높이를 잡아먹던 전환율 요약 블록은 렌더링하지 않는다", async () => {
    renderRetention();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-dashboard-retention-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.queryByText("활성화율")).not.toBeInTheDocument();
    expect(screen.queryByText("재방문율")).not.toBeInTheDocument();
    expect(screen.queryByText("핵심 전환율")).not.toBeInTheDocument();
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_user_retention_funnel", () => {
        return HttpResponse.error();
      }),
    );

    renderRetention();

    expect(await screen.findByTestId("admin-dashboard-retention-error")).toBeInTheDocument();
  });
});
