import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ICompetition } from "@admin/admin-competition/api/admin-competition-api";
import { AdminCompetitionEditModal } from "@admin/admin-competition/components/modal/admin-competition-edit-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-competition/api/react-query-api/use-update-competition", () => ({
  useUpdateCompetition: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

vi.mock("@admin/admin-competition/api/react-query-api/use-get-all-competition-types", () => ({
  useGetAllCompetitionTypes: () => ({ data: [{ id: "type-1", name: "분데스리가" }] }),
}));

vi.mock("@admin/admin-competition/api/react-query-api/use-get-all-seasons", () => ({
  useGetAllSeasons: () => ({ data: ["2024-25"] }),
}));

const baseCompetition = {
  id: "comp-1",
  name: "분데스리가",
  season: "2024-25",
  competition_type_id: "type-1",
} as ICompetition;

describe("AdminCompetitionEditModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링한다", () => {
    render(<AdminCompetitionEditModal competition={baseCompetition} onClose={vi.fn()} />);

    expect(screen.getByText("대회 수정")).toBeInTheDocument();
    expect(screen.getByText("대회 종류")).toBeInTheDocument();
    expect(screen.getByText("시즌")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "수정" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  // 버튼을 잠가두면 왜 못 누르는지 알 수 없어, 눌러보면 사유를 알려주는 쪽으로 바꿨다
  it("대회 종류·시즌이 비어 있으면 갱신하지 않고 사유를 보여준다", async () => {
    const onClose = vi.fn();
    render(
      <AdminCompetitionEditModal
        competition={{ ...baseCompetition, name: "", season: "" } as ICompetition}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    expect(await screen.findByText("대회 종류를 선택해주세요")).toBeInTheDocument();
    expect(screen.getByText("시즌을 선택해주세요")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("수정 클릭 시 프리필된 값으로 수정하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminCompetitionEditModal competition={baseCompetition} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "수정" }));

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: "comp-1",
        competition_type_id: "type-1",
        season: "2024-25",
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 수정 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminCompetitionEditModal competition={baseCompetition} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
