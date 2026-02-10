import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import AuthInfoPointCard from "./auth-info-point-card";
import AuthInfoPointCardErrorFallback from "./error/auth-info-point-card-error-fallback";
import AuthInfoPointCardSkeleton from "./skeleton/auth-info-point-card-skeleton";

import { getAnonymousUserAuthMock, getKakaoUserAuthMock } from "@shared/mocks/constants/user-mock-data";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AuthInfoPointCardSkeleton />}
        errorFallback={AuthInfoPointCardErrorFallback}
      >
        {component}
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("auth-info-point-card-skeleton")).not.toBeInTheDocument();
  });
};

describe("AuthInfoPointCard", () => {
  it("카카오 로그인 유저일 때 가지고 있는 보유 포인트를 표시한다", async () => {
    mockUseAuth.mockReturnValue(getKakaoUserAuthMock());

    server.use(
      http.post("*/rest/v1/rpc/get_profile_with_points", () => {
        return HttpResponse.json({ points: 500 });
      }),
    );

    renderWithQueryClient(<AuthInfoPointCard />);
    await waitForLoadingComplete();

    expect(await screen.findByTestId("auth-info-point-card-points")).toHaveTextContent("500p");
  });

  it("익명 로그인 유저일 때는 항상 0p를 표시한다", async () => {
    mockUseAuth.mockReturnValue(getAnonymousUserAuthMock());

    // 익명 사용자는 포인트 얻는 행위를 할 수 없음
    server.use(
      http.post("*/rest/v1/rpc/get_profile_with_points", () => {
        return HttpResponse.json(null);
      }),
    );

    renderWithQueryClient(<AuthInfoPointCard />);
    await waitForLoadingComplete();

    expect(await screen.findByTestId("auth-info-point-card-points")).toHaveTextContent("0p");
  });
});
