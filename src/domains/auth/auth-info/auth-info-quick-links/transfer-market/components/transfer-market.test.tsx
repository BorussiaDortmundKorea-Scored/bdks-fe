import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import TransferMarketErrorFallback from "@auth/auth-info/auth-info-quick-links/transfer-market/components/error/transfer-market-error-fallback";
import TransferMarketSkeleton from "@auth/auth-info/auth-info-quick-links/transfer-market/components/skeleton/transfer-market-skeleton";
import TransferMarket from "@auth/auth-info/auth-info-quick-links/transfer-market/components/transfer-market";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ReactQueryBoundary skeleton={<TransferMarketSkeleton />} errorFallback={TransferMarketErrorFallback}>
        <TransferMarket />
      </ReactQueryBoundary>
    </QueryClientProvider>,
  );
};

const waitForLoadingComplete = async () => {
  await waitFor(() => {
    expect(screen.queryByTestId("transfer-market-skeleton")).not.toBeInTheDocument();
  });
};

describe("TransferMarket", () => {
  it("RPC get_transfers 결과를 이적 카드 리스트로 렌더링한다", async () => {
    renderWithQueryClient();
    await waitForLoadingComplete();

    // 리스트가 렌더링되는지
    expect(screen.getByTestId("transfer-market-list")).toBeInTheDocument();

    // 선수 이름
    expect(await screen.findByText("카림 아데예미")).toBeInTheDocument();
    expect(screen.getByText("파스칼 그로스")).toBeInTheDocument();
    expect(screen.getByText("유수파 무코코")).toBeInTheDocument();
    expect(screen.getByText("마르셀 자비처")).toBeInTheDocument();

    // 방향/유형 칩 (임대 / 영입 / 방출)
    expect(screen.getByText("영입")).toBeInTheDocument(); // 완전 영입
    expect(screen.getByText("방출")).toBeInTheDocument(); // 완전 방출
    expect(screen.getAllByText("임대")).toHaveLength(2); // 임대방출 + 임대영입

    // 이적금액 포맷 (30M / 비공개 / 무료 / 2M)
    expect(screen.getByText("30M €")).toBeInTheDocument();
    expect(screen.getByText("비공개")).toBeInTheDocument();
    expect(screen.getByText("무료")).toBeInTheDocument();
    expect(screen.getByText("2M €")).toBeInTheDocument();

    // 좋아요/싫어요 버튼 (행마다)
    expect(screen.getAllByLabelText("좋아요")).toHaveLength(4);
    expect(screen.getAllByLabelText("싫어요")).toHaveLength(4);
  });

  it("은퇴는 은퇴 칩만 두고(금액 없음) 도르트문트 → 은퇴 경로로 그린다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_transfers", () =>
        HttpResponse.json([
          {
            id: "r1",
            player_id: "p-sule",
            player_name: "Niklas Süle",
            player_korean_name: "니클라스 쥘레",
            head_profile_image_url: null,
            full_profile_image_url: null,
            direction: "OUT",
            transfer_type: "RETIRED",
            counterpart_team_id: null,
            counterpart_club_name: null,
            counterpart_logo_image_url: null,
            transfer_date: "2026-07-01",
            euro_fee: null,
            like_count: 0,
            dislike_count: 0,
            my_reaction: null,
          },
        ]),
      ),
    );

    renderWithQueryClient();

    expect(await screen.findByText("니클라스 쥘레")).toBeInTheDocument();
    // 칩 + 경로 도착지
    expect(screen.getAllByText("은퇴")).toHaveLength(2);
    expect(screen.getByText("도르트문트")).toBeInTheDocument();
    expect(screen.queryByText("비공개")).not.toBeInTheDocument();
    expect(screen.queryByText("방출")).not.toBeInTheDocument();
  });

  it("RPC 에러가 발생하면 에러 폴백을 렌더링한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_transfers", () => {
        return HttpResponse.json({ message: "error" }, { status: 500 });
      }),
    );

    renderWithQueryClient();

    expect(await screen.findByTestId("transfer-market-error")).toBeInTheDocument();
  });
});
