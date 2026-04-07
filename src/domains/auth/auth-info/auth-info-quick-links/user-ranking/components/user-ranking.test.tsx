import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import UserRankingErrorFallback from "@auth/auth-info/auth-info-quick-links/user-ranking/components/error/user-ranking-error-fallback";
import UserRankingSkeleton from "@auth/auth-info/auth-info-quick-links/user-ranking/components/skeleton/user-ranking-skeleton";
import UserRanking from "@auth/auth-info/auth-info-quick-links/user-ranking/components/user-ranking";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<UserRankingSkeleton />} errorFallback={UserRankingErrorFallback}>
        <UserRanking />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("user-ranking-skeleton")).not.toBeInTheDocument();
  });
};

describe("UserRanking", () => {
  it("평점 입력 횟수 TOP 3 회원 섹션을 렌더링한다", async () => {
    renderWithQueryClient();
    await waitForLoadingComplete();

    expect(screen.getByText("평점 입력 횟수 TOP 3 회원")).toBeInTheDocument();
    expect(screen.getByText("직관 횟수 TOP 3 회원")).toBeInTheDocument();
  });

  it("더미 데이터 기준 닉네임이 노출된다", async () => {
    renderWithQueryClient();
    await waitForLoadingComplete();

    // user-rating-ranking-dummy.json 기준 (평점 + 직관 두 섹션에 동일 닉네임 노출)
    const nicknames = await screen.findAllByText("보돌코주인장");
    expect(nicknames.length).toBe(2);
  });

  it("1st, 2nd, 3rd 순위 표기가 노출된다", async () => {
    renderWithQueryClient();
    await waitForLoadingComplete();

    expect(screen.getAllByText("st").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("nd").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("rd").length).toBeGreaterThanOrEqual(1);
  });

  it("RPC 에러가 발생하면 에러 폴백을 렌더링한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_user_rating_ranking", () => {
        return HttpResponse.json({ message: "error" }, { status: 500 });
      }),
    );

    renderWithQueryClient();

    expect(await screen.findByTestId("user-ranking-error")).toBeInTheDocument();
  });
});
