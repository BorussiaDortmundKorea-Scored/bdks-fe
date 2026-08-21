import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchLineupAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-add-modal";

const { createLineupMock, isCreatingRef } = vi.hoisted(() => ({
  createLineupMock: vi.fn(),
  isCreatingRef: { current: false },
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

describe("AdminMatchLineupAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isCreatingRef.current = false;
    createLineupMock.mockResolvedValue(undefined);
  });

  it("제목·라벨·버튼을 렌더링한다", () => {
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByText("새 선수 추가")).toBeInTheDocument();
    expect(screen.getByText("선수 *")).toBeInTheDocument();
    expect(screen.getByText("라인업 타입 *")).toBeInTheDocument();
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

  it("추가 클릭 시 매치 ID와 함께 라인업을 등록하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(createLineupMock).toHaveBeenCalledWith(expect.objectContaining({ match_id: "match-1" })),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("등록 진행 중이면 추가 버튼이 비활성화된다", () => {
    isCreatingRef.current = true;
    render(<AdminMatchLineupAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가 중..." })).toBeDisabled();
  });
});
