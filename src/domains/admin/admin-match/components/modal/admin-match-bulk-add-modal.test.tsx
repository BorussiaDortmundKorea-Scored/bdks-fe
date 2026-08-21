import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchBulkAddModal } from "@admin/admin-match/components/modal/admin-match-bulk-add-modal";

const bulkCreateMatchesMock = vi.fn();
const toastMock = vi.fn();

vi.mock("@admin/admin-competition/api/react-query-api/use-get-all-competitions-suspense", () => ({
  useGetAllCompetitionsSuspense: () => ({
    data: [{ id: "comp-1", name: "분데스리가", season: "2025-26" }],
  }),
}));

vi.mock("@admin/admin-team/api/react-query-api/use-get-all-teams-suspense", () => ({
  useGetAllTeamsSuspense: () => ({
    data: [{ id: "team-1", name: "바이에른 뮌헨" }],
  }),
}));

vi.mock("@admin/admin-match/api/react-query-api/use-bulk-create-matches", () => ({
  useBulkCreateMatches: () => ({ mutateAsync: bulkCreateMatchesMock, isPending: false }),
}));

vi.mock("@youngduck/yd-ui/Overlays", () => ({
  useOverlay: () => ({ toast: toastMock }),
}));

describe("AdminMatchBulkAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bulkCreateMatchesMock.mockResolvedValue(undefined);
  });

  it("제목·버튼·기본 경기 행(5개)을 렌더링한다", () => {
    render(<AdminMatchBulkAddModal onClose={vi.fn()} />);

    expect(screen.getByText("경기 일괄 추가")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "대량 추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();

    // 기본 경기 개수는 5개
    expect(screen.getByText("경기 1")).toBeInTheDocument();
    expect(screen.getByText("경기 5")).toBeInTheDocument();
    expect(screen.queryByText("경기 6")).not.toBeInTheDocument();
  });

  it("취소 클릭 시 생성 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchBulkAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(bulkCreateMatchesMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("경기 개수를 변경하면 렌더링되는 행 수가 늘어난다", () => {
    const { container } = render(<AdminMatchBulkAddModal onClose={vi.fn()} />);

    const countInput = container.querySelector('input[type="text"], input[inputmode="numeric"], input') as HTMLInputElement;
    expect(countInput).not.toBeNull();

    fireEvent.change(countInput, { target: { value: "7" } });

    expect(screen.getByText("경기 7")).toBeInTheDocument();
    expect(screen.queryByText("경기 8")).not.toBeInTheDocument();
  });

  it("필수값이 비어 있으면 대량 추가 시 안내 토스트를 노출하고 생성하지 않는다", () => {
    render(<AdminMatchBulkAddModal onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "대량 추가" }));

    expect(bulkCreateMatchesMock).not.toHaveBeenCalled();
    expect(toastMock).toHaveBeenCalledTimes(1);
  });
});
