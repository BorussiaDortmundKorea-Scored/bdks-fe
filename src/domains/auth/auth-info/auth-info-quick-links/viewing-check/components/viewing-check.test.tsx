import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import ViewingCheckErrorFallback from "@auth/auth-info/auth-info-quick-links/viewing-check/components/error/viewing-check-error-fallback";
import ViewingCheckSkeleton from "@auth/auth-info/auth-info-quick-links/viewing-check/components/skeleton/viewing-check-skeleton";
import ViewingCheck from "@auth/auth-info/auth-info-quick-links/viewing-check/components/viewing-check";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

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
    renderWithQueryClient();
    await waitForLoadingComplete();

    // 도감 그리드가 렌더링되는지 확인
    expect(screen.getByTestId("viewing-check-grid")).toBeInTheDocument();

    // 더미 데이터 기준으로 상대 팀 이름이 노출되는지 확인
    expect(await screen.findByText("유벤투스")).toBeInTheDocument();
    expect(await screen.findByText("RB 라이프치히")).toBeInTheDocument();

    // 직관 띠부띠부씰 헤더가 노출되는지 확인
    expect(screen.getByText("직관 띠부띠부씰")).toBeInTheDocument();

    // 관람 완료된 카드의 "직관" 뱃지 확인
    expect(screen.getByText("직관")).toBeInTheDocument();
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
