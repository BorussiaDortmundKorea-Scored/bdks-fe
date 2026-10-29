import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { type IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { AdminMatchLineupPlayerActionModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-player-action-modal";

const { updateMock, saveMock, positionsMock, deleteMock, confirmDialogMock, lineupsRef } = vi.hoisted(() => ({
  updateMock: vi.fn(),
  saveMock: vi.fn(),
  positionsMock: vi.fn(),
  deleteMock: vi.fn(),
  confirmDialogMock: vi.fn(),
  lineupsRef: { current: [] as unknown[] },
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup", () => ({
  useUpdateMatchLineup: () => ({ mutateAsync: updateMock, isPending: false }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-starting-lineup", () => ({
  useSaveMatchStartingLineup: () => ({ mutateAsync: saveMock, isPending: false }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-on-pitch-positions", () => ({
  useSaveMatchOnPitchPositions: () => ({ mutateAsync: positionsMock }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-positions-suspense", () => ({
  useGetAllPositionsSuspense: () => ({
    data: [
      { id: "pos-ST", position_code: "FW", position_detail_name: "ST", line_number: 1, sort_order: 20 },
      { id: "pos-CAM", position_code: "MF", position_detail_name: "CAM", line_number: 2, sort_order: 20 },
      { id: "pos-GK", position_code: "GK", position_detail_name: "GK", line_number: 5, sort_order: 10 },
    ],
  }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-delete-match-lineup", () => ({
  useDeleteMatchLineup: () => ({ mutateAsync: deleteMock }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense", () => ({
  useGetMatchLineupsSuspense: () => ({ data: lineupsRef.current }),
}));
vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ confirmDialog: confirmDialogMock }),
}));

const makeLineup = (over: Partial<IMatchLineup> = {}): IMatchLineup => ({
  id: 1,
  match_id: "match-1",
  player_id: "p-st",
  position_id: "pos-ST",
  position_detail_name: "ST",
  position_code: "FW",
  lineup_type: "STARTING",
  is_captain: false,
  sub_in_minute: null,
  sub_in_partner_id: null,
  sub_out_minute: null,
  sub_out_partner_id: null,
  sub_in_partner_name: null,
  sub_out_partner_name: null,
  yellow_cards: 0,
  red_card_minute: null,
  is_sent_off: false,
  goals: 1,
  assists: 0,
  player_name: "Guirassy",
  player_korean_name: "기라시",
  created_at: null,
  updated_at: null,
  ...over,
});

const renderModal = (lineup: IMatchLineup, formation: "4-2-3-1" | null = "4-2-3-1") => {
  const handlers = { onClose: vi.fn(), onOpenSubstitution: vi.fn(), onOpenEditDetail: vi.fn() };
  render(<AdminMatchLineupPlayerActionModal matchId="match-1" lineup={lineup} formation={formation} {...handlers} />);
  return handlers;
};

describe("AdminMatchLineupPlayerActionModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lineupsRef.current = [
      makeLineup(),
      makeLineup({
        id: 2,
        player_id: "p-gk",
        position_id: "pos-GK",
        position_detail_name: "GK",
        player_korean_name: "코벨",
      }),
    ];
    updateMock.mockResolvedValue(undefined);
    saveMock.mockResolvedValue(true);
    positionsMock.mockResolvedValue(true);
  });

  it("골·도움·경고를 고쳐 저장하면 바뀐 값으로 수정하고 닫는다 (자리·주장은 안 건드린다)", async () => {
    const { onClose } = renderModal(makeLineup());

    fireEvent.change(screen.getByLabelText("골"), { target: { value: "2" } });
    fireEvent.change(screen.getByLabelText("도움"), { target: { value: "1" } });
    fireEvent.click(within(screen.getByRole("radiogroup", { name: "경고" })).getByRole("radio", { name: "1장" }));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        position_id: "pos-ST",
        goals: 2,
        assists: 1,
        yellow_cards: 1,
        is_sent_off: false,
      }),
    );
    expect(positionsMock).not.toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
  });

  it("퇴장을 체크하고 시간을 비우면 저장하지 않고 사유를 보여준다", async () => {
    renderModal(makeLineup());

    fireEvent.click(screen.getByText("퇴장"));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    expect(await screen.findByText("퇴장 시간을 입력해주세요")).toBeInTheDocument();
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("주장을 체크해 저장하면 현재 선발 전체를 다시 보내며 이 선수만 주장으로 만든다", async () => {
    const { onClose } = renderModal(makeLineup());

    fireEvent.click(screen.getByText("주장"));
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(saveMock).toHaveBeenCalledWith({
      match_id: "match-1",
      formation: "4-2-3-1",
      lineups: [
        { player_id: "p-st", position_id: "pos-ST", is_captain: true },
        { player_id: "p-gk", position_id: "pos-GK", is_captain: false },
      ],
    });
  });

  it("다른 선수가 있는 자리를 고르면 서로 맞바꾸고, 기록 저장에도 새 자리를 보낸다", async () => {
    const { onClose } = renderModal(makeLineup());

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "GK · 코벨" }));
    expect(screen.getByText("코벨 선수와 자리를 맞바꿔요")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "저장" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(positionsMock).toHaveBeenCalledWith({
      match_id: "match-1",
      formation: "4-2-3-1",
      positions: [
        { player_id: "p-st", position_id: "pos-GK" },
        { player_id: "p-gk", position_id: "pos-ST" },
      ],
    });
    expect(updateMock).toHaveBeenCalledWith(expect.objectContaining({ id: 1, position_id: "pos-GK" }));
  });

  it("자리 비우기는 확인을 거친 뒤 그 선수만 뺀 선발로 저장한다", async () => {
    renderModal(makeLineup());

    fireEvent.click(screen.getByRole("button", { name: "자리 비우기" }));
    await confirmDialogMock.mock.calls[0][0].onConfirm();

    expect(saveMock).toHaveBeenCalledWith(
      expect.objectContaining({ lineups: [{ player_id: "p-gk", position_id: "pos-GK", is_captain: false }] }),
    );
  });

  it("교체·상세 수정은 부모가 넘긴 콜백으로 넘긴다", () => {
    const { onOpenSubstitution, onOpenEditDetail } = renderModal(makeLineup());

    fireEvent.click(screen.getByRole("button", { name: "교체" }));
    fireEvent.click(screen.getByRole("button", { name: "상세 수정" }));

    expect(onOpenSubstitution).toHaveBeenCalled();
    expect(onOpenEditDetail).toHaveBeenCalled();
  });

  it("뛰지 않은 후보는 교체·자리·주장·자리 비우기 대신 명단 삭제만 보인다", () => {
    renderModal(makeLineup({ lineup_type: "BENCH", position_id: null, position_detail_name: null }));

    expect(screen.queryByRole("button", { name: "교체" })).not.toBeInTheDocument();
    expect(screen.queryByText("주장")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "자리 비우기" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "명단에서 삭제" })).toBeInTheDocument();
  });

  it("교체 아웃된 선발은 교체·자리 비우기를 할 수 없다", () => {
    renderModal(makeLineup({ sub_out_minute: 70 }));

    expect(screen.queryByRole("button", { name: "교체" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "자리 비우기" })).not.toBeInTheDocument();
  });
});
