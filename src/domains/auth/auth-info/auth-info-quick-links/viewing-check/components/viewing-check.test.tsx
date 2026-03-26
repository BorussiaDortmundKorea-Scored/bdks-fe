import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { vi } from "vitest";

import ViewingCheckErrorFallback from "@auth/auth-info/auth-info-quick-links/viewing-check/components/error/viewing-check-error-fallback";
import ViewingCheckSkeleton from "@auth/auth-info/auth-info-quick-links/viewing-check/components/skeleton/viewing-check-skeleton";
import ViewingCheck from "@auth/auth-info/auth-info-quick-links/viewing-check/components/viewing-check";

import { getKakaoUserAuthMock } from "@shared/mocks/constants/user-mock-data";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

// 모킹 모듈 가져오기
const mockUseAuth = vi.fn();

vi.mock("@auth/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}));
// 유저 모킹 함수들
const mockKakaoUser = () => {
  mockUseAuth.mockReturnValue(getKakaoUserAuthMock());
};

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<ViewingCheckSkeleton />} errorFallback={ViewingCheckErrorFallback}>
        <ViewingCheck />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("viewing-check-skeleton")).not.toBeInTheDocument();
  });
};

describe("ViewingCheck", () => {
  it("RPC get_viewing_matches 결과를 도감 그리드로 렌더링한다", async () => {
    mockKakaoUser();
    renderWithQueryClient();
    await waitForLoadingComplete();

    // 도감 그리드가 렌더링되는지 확인
    expect(screen.getByTestId("viewing-check-grid")).toBeInTheDocument();

    // 더미 데이터 기준으로 상대 팀 이름이 노출되는지 확인 (PAST + TODAY만, UPCOMING 없음)
    expect(await screen.findByText("유벤투스")).toBeInTheDocument();
    expect(await screen.findByText("RB 라이프치히")).toBeInTheDocument();

    // 직관 띠부띠부씰 헤더가 노출되는지 확인
    expect(screen.getByText("직관 띠부띠부씰")).toBeInTheDocument();

    // 관람 완료된 카드의 "직관" 뱃지 확인
    expect(screen.getByText("직관")).toBeInTheDocument();
  });

  it("오늘 경기 카드를 누르면 insert_viewing_check RPC를 호출한다", async () => {
    mockKakaoUser();
    const fetchSpy = vi.spyOn(global, "fetch");

    renderWithQueryClient();
    await waitForLoadingComplete();

    // TODAY 상태이면서 미관람인 카드 (RB 라이프치히) 관람체크 버튼 클릭
    const viewingCheckButton = await screen.findByRole("button", {
      name: /RB 라이프치히 - 관람체크/,
    });
    await userEvent.click(viewingCheckButton);

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining("/rest/v1/rpc/insert_viewing_check"),
      expect.any(Object),
    );

    fetchSpy.mockRestore();
  });

  it("RPC 에러가 발생하면 에러 폴백을 렌더링한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_viewing_matches", () => {
        return HttpResponse.json({ message: "error" }, { status: 500 });
      }),
    );

    renderWithQueryClient();

    expect(await screen.findByTestId("viewing-check-error")).toBeInTheDocument();
  });
});
