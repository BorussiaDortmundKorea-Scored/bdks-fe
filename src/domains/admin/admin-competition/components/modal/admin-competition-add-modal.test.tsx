import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminCompetitionAddModal } from "@admin/admin-competition/components/modal/admin-competition-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-competition/api/react-query-api/use-create-competition", () => ({
  useCreateCompetition: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

vi.mock("@admin/admin-competition/api/react-query-api/use-get-all-competition-types", () => ({
  useGetAllCompetitionTypes: () => ({ data: [{ id: "type-1", name: "분데스리가" }] }),
}));

vi.mock("@admin/admin-competition/api/react-query-api/use-get-all-seasons", () => ({
  useGetAllSeasons: () => ({ data: ["2024-25"] }),
}));

describe("AdminCompetitionAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링한다", () => {
    render(<AdminCompetitionAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 대회 추가")).toBeInTheDocument();
    expect(screen.getByText("대회 종류")).toBeInTheDocument();
    expect(screen.getByText("시즌")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  // 버튼을 잠가두면 왜 못 누르는지 알 수 없어, 눌러보면 사유를 알려주는 쪽으로 바꿨다
  it("대회 종류·시즌을 고르지 않으면 등록하지 않고 사유를 보여준다", async () => {
    const onClose = vi.fn();
    render(<AdminCompetitionAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("대회 종류를 선택해주세요")).toBeInTheDocument();
    expect(screen.getByText("시즌을 선택해주세요")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminCompetitionAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
