import { MemoryRouter } from "react-router-dom";

import AuthInfoProfileCard from "./auth-info-profile-card";
import AuthInfoProfileCardErrorFallback from "./error/auth-info-profile-card-error-fallback";
import AuthInfoProfileCardSkeleton from "./skeleton/auth-info-profile-card-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import { getAnonymousUserAuthMock } from "@shared/mocks/constants/user-mock-data";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const { mockUseAuth, mockToast } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockToast: vi.fn(),
}));

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: mockToast }),
}));

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryBoundary skeleton={<AuthInfoProfileCardSkeleton />} errorFallback={AuthInfoProfileCardErrorFallback}>
          {component}
        </ReactQueryBoundary>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("auth-info-profile-card-skeleton")).not.toBeInTheDocument();
  });
};

describe("AuthInfoProfileCard", () => {
  it("익명 로그인 유저가 프로필 수정 버튼을 누르면 토스트를 표시한다", async () => {
    mockUseAuth.mockReturnValue(getAnonymousUserAuthMock());

    server.use(
      http.post("*/rest/v1/rpc/get_profile_summary", () => {
        return HttpResponse.json(null);
      }),
    );

    renderWithQueryClient(<AuthInfoProfileCard />);
    await waitForLoadingComplete();

    const editButton = screen.getByText("프로필 수정");
    await userEvent.click(editButton);

    expect(mockToast).toHaveBeenCalledWith({ content: "익명 로그인 유저는 이용할 수 없어요" });
  });
});
