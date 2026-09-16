/**
 * 작성자: KYD
 * 기능: 인기 최애선수 순위(AdminUserPopularPlayers) 컴포넌트 렌더링 테스트
 */
import AdminUserPopularPlayers from "./admin-user-popular-players";
import AdminUserPopularPlayersErrorFallback from "./error/admin-user-popular-players-error-fallback";
import AdminUserPopularPlayersSkeleton from "./skeleton/admin-user-popular-players-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderPopularPlayers = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AdminUserPopularPlayersSkeleton />}
        errorFallback={AdminUserPopularPlayersErrorFallback}
      >
        <AdminUserPopularPlayers />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("인기 최애선수 순위 컴포넌트 렌더링 테스트", () => {
  it("로딩 후 순위·선수명·등록자 수가 렌더링된다", async () => {
    renderPopularPlayers();

    await waitFor(() => {
      expect(screen.queryByTestId("admin-user-popular-players-skeleton")).not.toBeInTheDocument();
    });

    expect(screen.getByText("인기 최애선수")).toBeInTheDocument();
    expect(screen.getByText("율리안 리에르손")).toBeInTheDocument();
    // 더미 합계: 13 + 7 + 7 + 5 + 3 = 35명 / 선수 5명
    expect(screen.getByText("등록 35명 / 선수 5명")).toBeInTheDocument();
    expect(screen.getByText("13명 (24.1%)")).toBeInTheDocument();
    // 동률(7명) 두 명은 등록자 수가 동일하게 표기된다
    expect(screen.getAllByText("7명 (13.0%)")).toHaveLength(2);
  });

  it("등록된 최애선수가 없으면 안내 문구를 노출한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_popular_favorite_players", () => {
        return HttpResponse.json([]);
      }),
    );

    renderPopularPlayers();

    expect(await screen.findByText("아직 최애선수를 등록한 사용자가 없습니다")).toBeInTheDocument();
  });

  it("API 실패 시 에러 폴백이 렌더링된다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_popular_favorite_players", () => {
        return HttpResponse.error();
      }),
    );

    renderPopularPlayers();

    expect(await screen.findByTestId("admin-user-popular-players-error")).toBeInTheDocument();
  });
});
