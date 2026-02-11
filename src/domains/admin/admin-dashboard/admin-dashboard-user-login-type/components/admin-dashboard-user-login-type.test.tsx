/**
 * 작성자: KYD
 * 기능: 로그인 유형(카카오/익명) 대시보드 컴포넌트 테스트
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it, vi } from "vitest";

import AdminDashboardUserLoginType from "./admin-dashboard-user-login-type";
import AdminDashboardUserLoginTypeError from "./error/admin-dashboard-user-login-type-error";
import AdminDashboardUserLoginTypeSkeleton from "./skeleton/admin-dashboard-user-login-type-skeleton";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

vi.mock("react-chartjs-2", () => ({
  Pie: () => <div data-testid="login-type-pie-chart">Chart</div>,
}));

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AdminDashboardUserLoginTypeSkeleton />}
        errorFallback={AdminDashboardUserLoginTypeError}
      >
        {component}
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("admin-dashboard-user-login-type-skeleton")).not.toBeInTheDocument();
  });
};

describe("로그인 유형 대시보드 렌더링 테스트", () => {
  it("API 호출 전에는 로딩 컴포넌트가 나오고, 성공 후 본문이 렌더링된다", async () => {
    renderWithQueryClient(<AdminDashboardUserLoginType />);

    const loading = await screen.findByTestId("admin-dashboard-user-login-type-skeleton");
    expect(loading).toBeInTheDocument();

    await waitForLoadingComplete();
    expect(await screen.findByText("회원 유형")).toBeInTheDocument();
  });

  it("성공 시 회원 유형 제목과 파이 차트가 렌더링된다", async () => {
    renderWithQueryClient(<AdminDashboardUserLoginType />);
    await waitForLoadingComplete();

    expect(screen.getByText("회원 유형")).toBeInTheDocument();
    expect(screen.getByTestId("login-type-pie-chart")).toBeInTheDocument();
  });

  it("성공 시 파이 차트 영역이 렌더링된다", async () => {
    renderWithQueryClient(<AdminDashboardUserLoginType />);
    await waitForLoadingComplete();

    expect(screen.getByTestId("login-type-pie-chart")).toBeInTheDocument();
  });

  it("에러 발생 시 에러 컴포넌트가 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_user_login_type_counts", () => HttpResponse.error()),
    );

    renderWithQueryClient(<AdminDashboardUserLoginType />);

    const loading = await screen.findByTestId("admin-dashboard-user-login-type-skeleton");
    expect(loading).toBeInTheDocument();

    const errorEl = await screen.findByTestId("admin-dashboard-user-login-type-error");
    expect(errorEl).toBeInTheDocument();
  });
});
