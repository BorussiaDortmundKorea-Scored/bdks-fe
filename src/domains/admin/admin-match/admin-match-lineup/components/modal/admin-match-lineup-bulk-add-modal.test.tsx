import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchLineupBulkAddModal } from "@admin/admin-match/admin-match-lineup/components/modal/admin-match-lineup-bulk-add-modal";

const { bulkCreateMock, toastMock, isCreatingRef } = vi.hoisted(() => ({
  bulkCreateMock: vi.fn(),
  toastMock: vi.fn(),
  isCreatingRef: { current: false },
}));

vi.mock("@admin/admin-match/admin-match-lineup/api/react-query-api/use-bulk-create-match-lineups", () => ({
  useBulkCreateMatchLineups: () => ({ mutateAsync: bulkCreateMock, isPending: isCreatingRef.current }),
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

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));

describe("AdminMatchLineupBulkAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isCreatingRef.current = false;
    bulkCreateMock.mockResolvedValue(undefined);
  });

  it("제목과 11명 분량의 선수 슬롯을 렌더링한다", () => {
    render(<AdminMatchLineupBulkAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByText("스타팅 명단등록")).toBeInTheDocument();
    expect(screen.getByText("선수 1")).toBeInTheDocument();
    expect(screen.getByText("선수 11")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "일괄 추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupBulkAddModal matchId="match-1" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(bulkCreateMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("선수를 한 명도 선택하지 않고 일괄 추가하면 토스트를 띄우고 등록하지 않는다", async () => {
    const onClose = vi.fn();
    render(<AdminMatchLineupBulkAddModal matchId="match-1" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "일괄 추가" }));

    await waitFor(() => expect(toastMock).toHaveBeenCalledWith({ content: "최소 1명의 선수를 선택해주세요." }));
    expect(bulkCreateMock).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("등록 진행 중이면 일괄 추가 버튼이 비활성화된다", () => {
    isCreatingRef.current = true;
    render(<AdminMatchLineupBulkAddModal matchId="match-1" onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가 중..." })).toBeDisabled();
  });
});
