import { MemoryRouter } from "react-router-dom";

import AdminDashboardUserCount from "./admin-dashboard-user-count";
import AdminDashboardUserCountError from "./error/admin-dashboard-user-count-error";
import AdminDashboardUserCountSkeleton from "./skeleton/admin-dashboard-user-count-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryBoundary skeleton={<AdminDashboardUserCountSkeleton />} errorFallback={AdminDashboardUserCountError}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("admin-dashboard-user-count-skeleton")).not.toBeInTheDocument();
  });
};

const renderAndWaitForLoad = async (component: React.ReactElement) => {
  renderWithQueryClient(component);
  await waitForLoadingComplete();
};

describe("회원수 대쉬보드 렌더링 테스트", () => {
  it("API호출 전에는 로딩컴포넌트가 나와야하고, 성공 후 본문이 렌더링되어야 한다", async () => {
    renderWithQueryClient(<AdminDashboardUserCount />);

    // 로딩
    const loadingElement = await screen.findByTestId("admin-dashboard-user-count-skeleton");
    expect(loadingElement).toBeInTheDocument();

    // 성공 후 본문
    await waitForLoadingComplete();
    expect(await screen.findByText("회원 수")).toBeInTheDocument();
  });

  it("성공 시 총회원수와 전월대비 퍼센트 값이 렌더링된다", async () => {
    // 기본 핸들러가 dummy 응답 제공: { total_users: 18, monthly_growth_percent: 650 }
    await renderAndWaitForLoad(<AdminDashboardUserCount />);

    expect(screen.getByText(/회원 수/)).toBeInTheDocument();
    expect(screen.getByText(/18명/)).toBeInTheDocument();
    expect(screen.getByText(/650%/)).toBeInTheDocument();
  });

  it("에러 발생 시 에러 컴포넌트가 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_user_total_and_monthly_percent", () => {
        return HttpResponse.error();
      }),
    );

    renderWithQueryClient(<AdminDashboardUserCount />);

    // 로딩 노출
    const loading = await screen.findByTestId("admin-dashboard-user-count-skeleton");
    expect(loading).toBeInTheDocument();

    // 에러 폴백
    const errorEl = await screen.findByTestId("admin-dashboard-user-count-error");
    expect(errorEl).toBeInTheDocument();
  });
});
