import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchLineupAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-add-modal";

const { createLineupMock, isCreatingRef, registeredLineupsRef } = vi.hoisted(() => ({
  createLineupMock: vi.fn(),
  isCreatingRef: { current: false },
  registeredLineupsRef: { current: [] as { player_id: string }[] },
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-create-match-lineup", () => ({
  useCreateMatchLineup: () => ({ mutateAsync: createLineupMock, isPending: isCreatingRef.current }),
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({
    data: [
      { id: "player-1", name: "Player One", korean_name: "선수일", jersey_number: 7 },
      { id: "player-2", name: "Player Two", korean_name: "선수이", jersey_number: 9 },
    ],
  }),
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense", () => ({
  useGetAllPositionsSuspense: () => ({
    data: [{ id: "pos-1", position_detail_name: "센터백", position_code: "CB" }],
  }),
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense", () => ({
  useGetMatchLineupsSuspense: () => ({ data: registeredLineupsRef.current }),
}));

describe("AdminMatchLineupAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isCreatingRef.current = false;
    registeredLineupsRef.current = [];
    createLineupMock.mockResolvedValue(undefined);
  });

  it("제목·라벨·버튼을 렌더링한다", () => {
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByText("새 선수 추가")).toBeInTheDocument();
    expect(screen.getByText("선수")).toBeInTheDocument();
    expect(screen.getByText("라인업 타입")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(createLineupMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // 예전에는 선수를 안 고르고도 player_id 를 빈 문자열로 보내버렸다
  it("선수를 고르지 않으면 등록하지 않고 사유를 보여준다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("선수를 선택해주세요")).toBeInTheDocument();
    expect(createLineupMock).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("추가 클릭 시 매치 ID와 함께 라인업을 등록하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={onClose} />);

    fireEvent.click(screen.getAllByRole("combobox")[0]);
    fireEvent.click(await screen.findByText("선수일 (7번)"));
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(createLineupMock).toHaveBeenCalledWith(
        expect.objectContaining({ match_id: "match-1", player_id: "player-1" }),
      ),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  // 경기 진행 중 선수를 추가할 때 이미 명단에 있는 선수가 또 보이면 고르기 번거롭다
  it("이미 이 경기 명단에 있는 선수는 선수 목록에서 빠진다", async () => {
    registeredLineupsRef.current = [{ player_id: "player-1" }];
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    fireEvent.click(screen.getAllByRole("combobox")[0]);

    expect(await screen.findByText("선수이 (9번)")).toBeInTheDocument();
    expect(screen.queryByText("선수일 (7번)")).not.toBeInTheDocument();
  });

  // 교체 파트너는 이미 명단에 올라간 선수를 지목하는 자리라 걸러내면 안 된다
  it("교체 파트너 목록에는 이미 명단에 있는 선수도 그대로 남는다", async () => {
    registeredLineupsRef.current = [{ player_id: "player-1" }];
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    // 0: 선수, 1: 포지션, 2: 라인업 타입, 3: 대신 들어간 선수
    fireEvent.click(screen.getAllByRole("combobox")[3]);

    expect(await screen.findByText("선수일 (7번)")).toBeInTheDocument();
  });

  it("추가할 수 있는 선수가 없으면 안내 문구를 보여준다", () => {
    registeredLineupsRef.current = [{ player_id: "player-1" }, { player_id: "player-2" }];
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByText(/추가할 수 있는 선수가 없습니다/)).toBeInTheDocument();
  });

  it("등록 진행 중이면 추가 버튼이 비활성화된다", () => {
    isCreatingRef.current = true;
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가 중..." })).toBeDisabled();
  });
});
