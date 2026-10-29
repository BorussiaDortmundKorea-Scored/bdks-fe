import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminTransferEditModal } from "@admin/admin-transfer/components/modal/admin-transfer-edit-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-transfer/api/react-query-api/use-update-transfer", () => ({
  useUpdateTransfer: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

vi.mock("@admin/admin-player/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({ data: [{ id: "p1", name: "Reus", korean_name: "로이스" }] }),
}));

vi.mock("@admin/admin-team/api/react-query-api/use-get-all-teams-suspense", () => ({
  useGetAllTeamsSuspense: () => ({ data: [{ id: "t2", name: "바이에른 뮌헨" }] }),
}));

const transfer = {
  id: "tr5",
  player_id: "p1",
  player_name: "Reus",
  player_korean_name: "로이스",
  direction: "IN",
  transfer_type: "PERMANENT",
  counterpart_team_id: "t2",
  counterpart_club_name: "바이에른 뮌헨",
  transfer_date: "2024-07-01",
  euro_fee: 30000000,
} as never;

describe("AdminTransferEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·주요 필드 라벨·버튼을 렌더링한다", () => {
    render(<AdminTransferEditModal transfer={transfer} onClose={vi.fn()} />);

    expect(screen.getByText("이적 수정")).toBeInTheDocument();
    expect(screen.getByText("선수")).toBeInTheDocument();
    expect(screen.getByText("방향")).toBeInTheDocument();
    expect(screen.getByText("유형")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 30000000 (= 30M €)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("은퇴 기록은 상대 클럽·이적금액 칸 없이 열리고, 저장하면 둘을 비워 보낸다", async () => {
    const retired = {
      ...(transfer as object),
      direction: "OUT",
      transfer_type: "RETIRED",
      counterpart_team_id: null,
      counterpart_club_name: null,
      euro_fee: null,
    } as never;
    const onClose = vi.fn();
    render(<AdminTransferEditModal transfer={retired} onClose={onClose} />);

    expect(screen.getByText("은퇴일")).toBeInTheDocument();
    expect(screen.queryByText("상대 클럽")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("예: 30000000 (= 30M €)")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(mutateAsyncMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "tr5",
        direction: "OUT",
        transfer_type: "RETIRED",
        counterpart_team_id: null,
        euro_fee: null,
      }),
    );
  });

  it("취소 클릭 시 갱신 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminTransferEditModal transfer={transfer} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
