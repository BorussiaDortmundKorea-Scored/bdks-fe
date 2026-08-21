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

  it("대회 종류·시즌이 선택되지 않으면 추가 버튼이 비활성화된다", () => {
    render(<AdminCompetitionAddModal onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminCompetitionAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
