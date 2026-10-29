import { MemoryRouter, Route, Routes } from "react-router-dom";

import AdminMatchLineup from "./admin-match-lineup";
import AdminMatchLineupErrorFallback from "./error/admin-match-lineup-error-fallback";
import AdminMatchLineupSkeleton from "./skeleton/admin-match-lineup-skeleton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OverlayProvider } from "@youngduck/yd-ui/Overlays";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as lineupApi from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";

import { server } from "@shared/mocks/server";
import ReactQueryBoundary from "@shared/provider/react-query-boundary";

// jsdom 의 fetch 는 MSW 에 요청 본문을 넘겨주지 않아, 보낸 값은 API 함수에서 확인한다 (실제 호출은 그대로)
const { saveMatchOnPitchPositionsSpy } = vi.hoisted(() => ({
  saveMatchOnPitchPositionsSpy: vi.fn<(payload: lineupApi.ISaveMatchOnPitchPositionsRequest) => void>(),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api", async (importOriginal) => {
  const actual = await importOriginal<typeof lineupApi>();
  return {
    ...actual,
    saveMatchOnPitchPositions: (payload: lineupApi.ISaveMatchOnPitchPositionsRequest) => {
      saveMatchOnPitchPositionsSpy(payload);
      return actual.saveMatchOnPitchPositions(payload);
    },
  };
});

beforeEach(() => {
  saveMatchOnPitchPositionsSpy.mockClear();
});

const renderWithQueryClient = (initialEntries: string[]) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <OverlayProvider>
          <ReactQueryBoundary skeleton={<AdminMatchLineupSkeleton />} errorFallback={AdminMatchLineupErrorFallback}>
            <Routes>
              <Route path="/admin/match/:matchId/lineup" element={<AdminMatchLineup />} />
            </Routes>
          </ReactQueryBoundary>
        </OverlayProvider>
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

/** 표 탭으로 전환한다 (기본 탭은 보드) */
const openTableTab = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(await screen.findByRole("radio", { name: "표" }));
};

describe("AdminMatchLineup 보드 탭", () => {
  it("사용자 평점 화면과 같은 보드 헤더에 경기 정보를 보여주고, 그라운드 선수와 빈 자리를 그린다", async () => {
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    // 스켈레톤도 같은 FormationShell 이라, 헤더 경기정보가 뜬 뒤에 보드를 잡는다
    expect(await screen.findByText("도르트문트(H) vs 바이에른 뮌헨")).toBeInTheDocument();
    const board = screen.getByRole("region", { name: "포메이션" });
    expect(within(board).getByRole("button", { name: "마르코 로이스" })).toBeInTheDocument();
    expect(within(board).getByRole("button", { name: "그레고르 코벨" })).toBeInTheDocument();
    // 82분에 RAM 으로 들어와 뛰고 있는 선수도 그라운드에 앉는다
    expect(within(board).getByRole("button", { name: "카니 추쿠에메카" })).toBeInTheDocument();
    expect(within(board).getByRole("button", { name: "ST 비어 있음" })).toBeInTheDocument();
    // 교체 아웃 선수는 선발 화면에 없다
    expect(within(board).queryByRole("button", { name: "에단 은와네리" })).not.toBeInTheDocument();
  });

  it("교체 토글에서 자리 없는 출전 선수 · 후보 · 교체 아웃을 보여준다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    expect(await screen.findByText(/자리 없는 출전 선수 1명이 있어요/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "교체" }));

    expect(screen.getByText("자리 없는 출전 선수 (1)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "펠릭스 은메차" })).toBeInTheDocument();
    expect(screen.getByText(/^후보 \(\d+\)$/)).toBeInTheDocument();
    expect(screen.getByText("교체 아웃 (1)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "에단 은와네리" })).toBeInTheDocument();
  });

  it("빈 자리를 누르면 선수 배치 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    await user.click(await screen.findByRole("button", { name: "ST 비어 있음" }));

    expect(await screen.findByText("ST 자리에 선수 배치")).toBeInTheDocument();
  });

  it("선수를 누르면 선수 액션 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    await user.click(await screen.findByRole("button", { name: "마르코 로이스" }));

    expect(await screen.findByRole("heading", { name: "마르코 로이스" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "저장" })).toBeInTheDocument();
  });

  // 기록이 있는 선발도 막히지 않도록, 그라운드 선수는 그대로 두고 자리만 새 포메이션으로 옮겨 저장한다
  it("포메이션을 바꾸면 그라운드 선수의 자리만 옮기는 RPC 로 저장한다", async () => {
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    await screen.findByText("도르트문트(H) vs 바이에른 뮌헨");
    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "3-4-1-2" }));

    await waitFor(() => expect(saveMatchOnPitchPositionsSpy).toHaveBeenCalledTimes(1));
    const [payload] = saveMatchOnPitchPositionsSpy.mock.calls[0];
    expect(payload).toMatchObject({ match_id: "uuid", formation: "3-4-1-2" });
    // 4-2-3-1 → 3-4-1-2 는 자리 이름이 달라지므로 옮겨질 선수가 있다
    expect(payload.positions.length).toBeGreaterThan(0);
    expect(await screen.findByText("자리를 반영했어요")).toBeInTheDocument();
  });

  it("교체 화면의 후보 + 칸은 후보 선수 추가 모달을 연다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);

    await user.click(await screen.findByRole("button", { name: "교체" }));
    await user.click(screen.getByRole("button", { name: "후보 선수 추가" }));

    expect(await screen.findByRole("heading", { name: "후보 선수 추가" })).toBeInTheDocument();
  });
});

describe("AdminMatchLineup 표 탭", () => {
  it("수정 버튼 클릭 시 수정 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);
    await openTableTab(user);

    const row = (await screen.findByRole("cell", { name: "마르코 로이스" })).closest("tr");
    await user.click(within(row!).getByLabelText("수정"));

    expect(await screen.findByText("라인업 수정")).toBeInTheDocument();
  });

  it("선수 교체 버튼 클릭 시 교체 모달이 나와야한다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);
    await openTableTab(user);

    const row = (await screen.findByRole("cell", { name: "마르코 로이스" })).closest("tr");
    await user.click(within(row!).getByLabelText("교체"));

    expect(await screen.findByText("선수 교체")).toBeInTheDocument();
    expect(await screen.findByText(/선수를 교체합니다/)).toBeInTheDocument();
    expect(await screen.findByText("교체 적용")).toBeInTheDocument();
  });

  it("교체 투입 후 다시 교체 아웃된 선수는 두 시점이 모두 표시된다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);
    await openTableTab(user);

    const row = (await screen.findByRole("cell", { name: "에단 은와네리" })).closest("tr");

    expect(within(row!).getByText(/IN 27'/)).toBeInTheDocument();
    expect(within(row!).getByText(/OUT 82'/)).toBeInTheDocument();
    // 이미 교체 아웃된 선수는 더 이상 교체할 수 없다
    expect(within(row!).queryByLabelText("교체")).not.toBeInTheDocument();
  });

  it("교체로 투입돼 뛰고 있는 벤치 선수도 교체할 수 있다", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(["/admin/match/uuid/lineup"]);
    await openTableTab(user);

    const row = (await screen.findByRole("cell", { name: "카니 추쿠에메카" })).closest("tr");

    expect(within(row!).getByText(/IN 82'/)).toBeInTheDocument();
    expect(within(row!).getByLabelText("교체")).toBeInTheDocument();
  });
});
