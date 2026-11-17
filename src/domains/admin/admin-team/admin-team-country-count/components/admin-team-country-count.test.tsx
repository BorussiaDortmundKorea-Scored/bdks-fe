/**
 * 작성자: KYD
 * 기능: 국가별 팀 수 카드 렌더링 테스트
 */
import AdminTeamCountryCount from "./admin-team-country-count";
import AdminTeamCountryCountErrorFallback from "./error/admin-team-country-count-error-fallback";
import AdminTeamCountryCountSkeleton from "./skeleton/admin-team-country-count-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderCard = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary
        skeleton={<AdminTeamCountryCountSkeleton />}
        errorFallback={AdminTeamCountryCountErrorFallback}
      >
        <AdminTeamCountryCount />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("국가별 팀 수 카드", () => {
  it("로딩 후 제목과 차트를 렌더링한다", async () => {
    renderCard();

    expect(await screen.findByTestId("admin-team-country-count-chart")).toBeInTheDocument();
    expect(screen.getByText("국가별 팀 수")).toBeInTheDocument();
  });

  it("팀이 없으면 빈 상태를 보여준다", async () => {
    server.use(http.post("*/rest/v1/rpc/get_team_count_by_country", () => HttpResponse.json([])));
    renderCard();

    expect(await screen.findByText("등록된 팀이 없습니다.")).toBeInTheDocument();
  });

  it("조회 실패 시 에러 폴백을 보여준다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_team_count_by_country", () =>
        HttpResponse.json({ code: "PT403", message: "FORBIDDEN_ADMIN_ONLY" }, { status: 403 }),
      ),
    );
    renderCard();

    await waitFor(() => expect(screen.getByTestId("admin-team-country-count-error")).toBeInTheDocument());
  });
});
