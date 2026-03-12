import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";

import ViewingCheck from "@auth/auth-info/auth-info-quick-links/viewing-check/components/viewing-check";
import ViewingCheckErrorFallback from "@auth/auth-info/auth-info-quick-links/viewing-check/components/error/viewing-check-error-fallback";
import ViewingCheckSkeleton from "@auth/auth-info/auth-info-quick-links/viewing-check/components/skeleton/viewing-check-skeleton";
import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";
import { getKakaoUserAuthMock } from "@shared/mocks/constants/user-mock-data";
import { vi } from "vitest";

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
  it("RPC get_viewing_matches 결과를 화면에 렌더링한다", async () => {
    mockKakaoUser();
    renderWithQueryClient();
    await waitForLoadingComplete();

    // 더미 데이터 기준으로 상대 팀 이름이 노출되는지 확인
    expect(await screen.findByText(/바이에른 뮌헨/)).toBeInTheDocument();
    expect(await screen.findByText(/RB 라이프치히/)).toBeInTheDocument();

    // 섹션 헤더가 모두 노출되는지 확인
    expect(screen.getByText("오늘 경기")).toBeInTheDocument();
    expect(screen.getByText("다가오는 경기")).toBeInTheDocument();
    expect(screen.getByText("지난 경기")).toBeInTheDocument();

    // 버튼/배지 텍스트가 요구사항에 맞게 노출되는지 확인
    expect(screen.getAllByText("관람체크").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("알람신청")).toBeInTheDocument();
    // 지난 경기: 관람완료/미관람 노출
    expect(screen.getByText("관람완료")).toBeInTheDocument();
    expect(screen.getByText("미관람")).toBeInTheDocument();
  });

  it("오늘 경기에서 관람체크 버튼을 누르면 insert_viewing_check RPC를 호출한다", async () => {
    mockKakaoUser();
    const fetchSpy = vi.spyOn(global, "fetch");

    renderWithQueryClient();
    await waitForLoadingComplete();

    const viewingCheckButton = await screen.findByRole("button", { name: "관람체크" });
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

