import { MemoryRouter, Route, Routes } from "react-router-dom";

import AdminMatchLineup from "./admin-match-lineup";
import AdminMatchLineupErrorFallback from "./error/admin-match-lineup-error-fallback";
import AdminMatchLineupSkeleton from "./skeleton/admin-match-lineup-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OvelayProvider } from "@youngduck/yd-ui/Overlays";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

const renderWithQueryClient = (initialEntries: string[]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <OvelayProvider>
          <ReactQueryBoundary skeleton={<AdminMatchLineupSkeleton />} errorFallback={AdminMatchLineupErrorFallback}>
            <Routes>
              <Route path="/admin/match/:matchId/lineup" element={<AdminMatchLineup />} />
            </Routes>
          </ReactQueryBoundary>
        </OvelayProvider>
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("AdminMatchLineup 컴포넌트 렌더링 테스트", () => {
  it("API호출 전에는 로딩컴포넌트가 나와야하고, 성공 후 본문이 렌더링 되어야 한다", async () => {
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    // 로딩
    const loadingElement = await screen.findByTestId("admin-match-lineup-skeleton");
    expect(loadingElement).toBeInTheDocument();

    // 성공 후 본문
    await waitFor(() => {
      expect(screen.queryByTestId("admin-match-lineup-skeleton")).not.toBeInTheDocument();
    });

    screen.debug();

    expect(await screen.findByText("라인업 관리")).toBeInTheDocument();
  });

  it("API호출 실패시 에러컴포넌트가 나와야한다", async () => {
    server.use(
      http.post("*/rest/v1/rpc/get_match_lineups", () => {
        return HttpResponse.error();
      }),
    );
    renderWithQueryClient(["/admin/match/uuid/lineup"]);
    const errorElement = await screen.findByTestId("admin-match-lineup-error-fallback");
    expect(errorElement).toBeInTheDocument();
  });
});

describe("AdminMatchLineup 컴포넌트 기능 테스트", () => {
  it("선수 추가 버튼 클릭 시 추가 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    // 선수 추가 버튼 찾기
    const addButtons = await screen.findAllByLabelText("새 라인업 추가");
    const addButton = addButtons[0];
    expect(addButton).toBeInTheDocument();

    // 버튼 클릭
    await user.click(addButton);

    // 모달이 열렸는지 확인
    expect(await screen.findByText("새 선수 추가")).toBeInTheDocument();
    expect(await screen.findByText("선수 *")).toBeInTheDocument();
    expect(await screen.findByText("추가")).toBeInTheDocument();
  });

  it("스타팅 명단등록 버튼 클릭 시 일괄 추가 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    // 스타팅 명단등록 버튼 찾기
    const bulkAddButton = await screen.findByLabelText("스타팅 명단등록");
    expect(bulkAddButton).toBeInTheDocument();

    // 버튼 클릭
    await user.click(bulkAddButton);

    // 모달이 열렸는지 확인 (모달 내부의 고유한 텍스트로 확인)
    expect(await screen.findByText("선수 1")).toBeInTheDocument();
    expect(await screen.findByText("일괄 추가")).toBeInTheDocument();
  });

  it("수정 버튼 클릭 시 수정 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    // 특정 선수 이름을 기준으로 해당 행의 수정 버튼 찾기
    const playerName = await screen.findByText("마르코 로이스");
    const row = playerName.closest("tr");
    expect(row).toBeInTheDocument();

    const editButton = within(row!).getByLabelText("수정");
    expect(editButton).toBeInTheDocument();

    // 버튼 클릭
    await user.click(editButton);

    // 모달이 열렸는지 확인
    expect(await screen.findByText("라인업 수정")).toBeInTheDocument();
    expect(await screen.findByText("수정")).toBeInTheDocument();
  });

  it("선수 교체 버튼 클릭 시 교체 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    // 특정 선수 이름을 기준으로 해당 행의 교체 버튼 찾기
    const playerName = await screen.findByText("마르코 로이스");
    const row = playerName.closest("tr");
    expect(row).toBeInTheDocument();

    const replaceButton = within(row!).getByLabelText("교체");
    expect(replaceButton).toBeInTheDocument();

    // 버튼 클릭
    await user.click(replaceButton);

    // 모달이 열렸는지 확인
    expect(await screen.findByText("선수 교체")).toBeInTheDocument();
    expect(await screen.findByText(/선수를 교체합니다/)).toBeInTheDocument();
    expect(await screen.findByText("교체 적용")).toBeInTheDocument();
  });
});
