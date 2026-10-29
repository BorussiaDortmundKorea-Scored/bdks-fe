import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchLineupSlotPickerModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-slot-picker-modal";

const { saveMock } = vi.hoisted(() => ({ saveMock: vi.fn() }));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-save-match-starting-lineup", () => ({
  useSaveMatchStartingLineup: () => ({ mutateAsync: saveMock, isPending: false }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({
    data: [
      { id: "p-gk", name: "Kobel", korean_name: "코벨", jersey_number: 1 },
      { id: "p-sub", name: "Beier", korean_name: "바이어", jersey_number: 14 },
      { id: "p-used", name: "Brandt", korean_name: "브란트", jersey_number: 10 },
      { id: "p-free", name: "Adeyemi", korean_name: "아데예미", jersey_number: 27 },
      { id: "p-left", name: "Reus", korean_name: "로이스", jersey_number: 11, is_current_squad: false },
    ],
  }),
}));
vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-get-match-lineups-suspense", () => ({
  useGetMatchLineupsSuspense: () => ({
    data: [
      { player_id: "p-gk", position_id: "pos-GK", lineup_type: "STARTING", is_captain: true, sub_in_minute: null },
      { player_id: "p-sub", position_id: null, lineup_type: "BENCH", is_captain: false, sub_in_minute: null },
      // 이미 교체로 뛴 후보는 선발이 될 수 없다
      { player_id: "p-used", position_id: null, lineup_type: "BENCH", is_captain: false, sub_in_minute: 60 },
    ],
  }),
}));

const renderModal = (onClose = vi.fn()) => {
  render(
    <AdminMatchLineupSlotPickerModal
      matchId="match-1"
      formation="4-2-3-1"
      positionId="pos-ST"
      positionName="ST"
      onClose={onClose}
    />,
  );
  return { onClose };
};

describe("AdminMatchLineupSlotPickerModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    saveMock.mockResolvedValue(true);
  });

  it("후보를 먼저, 명단 밖 선수를 그다음에 보여주고 그라운드·이미 뛴 선수는 뺀다", () => {
    renderModal();

    fireEvent.click(screen.getByRole("combobox"));
    const options = within(screen.getByRole("listbox"))
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(options).toEqual(["바이어 (14번) · 후보", "아데예미 (27번)"]);
  });

  it("이적한 선수는 기본으로 빼고, 이적한 선수도 보기를 켜면 함께 보여준다", () => {
    renderModal();

    fireEvent.click(screen.getByText("이적한 선수도 보기"));
    fireEvent.click(screen.getByRole("combobox"));
    const options = within(screen.getByRole("listbox"))
      .getAllByRole("option")
      .map((option) => option.textContent);

    expect(options).toEqual(["바이어 (14번) · 후보", "아데예미 (27번)", "로이스 (11번) · 이적"]);
  });

  it("선수를 고르기 전에는 배치할 수 없다", () => {
    renderModal();

    expect(screen.getByRole("button", { name: "배치" })).toBeDisabled();
  });

  it("고른 선수를 기존 선발과 함께 그 자리로 저장하고 닫는다", async () => {
    const { onClose } = renderModal();

    fireEvent.click(screen.getByRole("combobox"));
    fireEvent.click(screen.getByRole("option", { name: "바이어 (14번) · 후보" }));
    fireEvent.click(screen.getByRole("button", { name: "배치" }));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(saveMock).toHaveBeenCalledWith({
      match_id: "match-1",
      formation: "4-2-3-1",
      lineups: [
        { player_id: "p-gk", position_id: "pos-GK", is_captain: true },
        { player_id: "p-sub", position_id: "pos-ST", is_captain: false },
      ],
    });
  });
});
