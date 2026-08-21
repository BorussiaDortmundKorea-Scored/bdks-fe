import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminTransferAddModal } from "@admin/admin-transfer/components/modal/admin-transfer-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-transfer/api/react-query-api/use-create-transfer", () => ({
  useCreateTransfer: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

vi.mock("@admin/admin-player/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({ data: [{ id: 1, name: "Reus", korean_name: "로이스" }] }),
}));

vi.mock("@admin/admin-team/api/react-query-api/use-get-all-teams-suspense", () => ({
  useGetAllTeamsSuspense: () => ({ data: [{ id: 2, name: "바이에른 뮌헨" }] }),
}));

describe("AdminTransferAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·주요 필드 라벨·버튼을 렌더링한다", () => {
    render(<AdminTransferAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 이적 추가")).toBeInTheDocument();
    expect(screen.getByText("선수 *")).toBeInTheDocument();
    expect(screen.getByText("방향 *")).toBeInTheDocument();
    expect(screen.getByText("유형 *")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 30000000 (= 30M €)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("필수 선택값(선수·방향·유형)이 없으면 추가 버튼이 비활성화된다", () => {
    render(<AdminTransferAddModal onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminTransferAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
