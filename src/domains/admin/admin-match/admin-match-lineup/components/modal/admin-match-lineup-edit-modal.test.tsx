import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { IMatchLineup } from "@admin/admin-match/admin-match-lineup/api/admin-match-lineup-api";
import { AdminMatchLineupEditModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-edit-modal";

const { updateLineupMock, isUpdatingRef } = vi.hoisted(() => ({
  updateLineupMock: vi.fn(),
  isUpdatingRef: { current: false },
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-update-match-lineup", () => ({
  useUpdateMatchLineup: () => ({ mutateAsync: updateLineupMock, isPending: isUpdatingRef.current }),
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

const mockLineup = {
  id: 1,
  match_id: "match-1",
  player_id: "player-1",
  position_id: "pos-1",
  lineup_type: "STARTING",
  is_captain: false,
  substitution_status: "NONE",
  substitution_minute: null,
  substitution_partner_id: null,
  yellow_cards: 0,
  red_card_minute: null,
  is_sent_off: false,
  goals: 0,
  assists: 0,
  player_name: "Player One",
  player_korean_name: "선수일",
  position_code: "CB",
  position_detail_name: "센터백",
} as unknown as IMatchLineup;

describe("AdminMatchLineupEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isUpdatingRef.current = false;
    updateLineupMock.mockResolvedValue(undefined);
  });

  it("제목·라벨·버튼을 렌더링한다", () => {
    render(<AdminMatchLineupEditModal matchId="match-1" lineup={mockLineup} onClose={vi.fn()} />);

    expect(screen.getByText("라인업 수정")).toBeInTheDocument();
    expect(screen.getByText("선수 *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("취소 클릭 시 수정 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupEditModal matchId="match-1" lineup={mockLineup} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(updateLineupMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("수정 클릭 시 라인업 ID·매치 ID와 함께 수정하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupEditModal matchId="match-1" lineup={mockLineup} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() =>
      expect(updateLineupMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockLineup.id, match_id: "match-1" }),
      ),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("수정 진행 중이면 수정 버튼이 비활성화된다", () => {
    isUpdatingRef.current = true;
    render(<AdminMatchLineupEditModal matchId="match-1" lineup={mockLineup} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "수정 중..." })).toBeDisabled();
  });
});
