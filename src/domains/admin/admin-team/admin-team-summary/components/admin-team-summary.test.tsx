/**
 * 작성자: KYD
 * 기능: 팀 현황 요약 카드 렌더링 테스트
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import AdminTeamSummary from "@admin/admin-team/admin-team-summary/components/admin-team-summary";
import AdminTeamSummaryErrorFallback from "@admin/admin-team/admin-team-summary/components/error/admin-team-summary-error-fallback";
import AdminTeamSummarySkeleton from "@admin/admin-team/admin-team-summary/components/skeleton/admin-team-summary-skeleton";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderCard = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<AdminTeamSummarySkeleton />} errorFallback={AdminTeamSummaryErrorFallback}>
        <AdminTeamSummary />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

describe("팀 현황 요약 카드", () => {
  it("전체 팀·등록 국가(미지정 제외)·국가 미지정 팀 수를 보여준다", async () => {
    renderCard();

    expect(await screen.findByTestId("admin-team-summary-전체 팀")).toHaveTextContent("30팀");
    expect(screen.getByTestId("admin-team-summary-등록 국가")).toHaveTextContent("3개국");
    expect(screen.getByTestId("admin-team-summary-국가 미지정")).toHaveTextContent("1팀");
    expect(screen.getByTestId("admin-team-summary-국가 미지정")).toHaveClass("text-primary-400");
  });

  it("국가 미지정 팀이 없으면 강조하지 않는다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_team_count_by_country", () =>
        HttpResponse.json([{ country_id: "c-de", country_name: "독일", team_count: 2 }]),
      ),
    );
    renderCard();

    expect(await screen.findByTestId("admin-team-summary-국가 미지정")).toHaveTextContent("0팀");
    expect(screen.getByTestId("admin-team-summary-국가 미지정")).not.toHaveClass("text-primary-400");
  });

  it("조회 실패 시 에러 폴백을 보여준다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_team_count_by_country", () =>
        HttpResponse.json({ code: "PT403", message: "FORBIDDEN_ADMIN_ONLY" }, { status: 403 }),
      ),
    );
    renderCard();

    await waitFor(() => expect(screen.getByTestId("admin-team-summary-error")).toBeInTheDocument());
  });
});
