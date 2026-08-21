import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminMatchAddModal } from "@admin/admin-match/components/modal/admin-match-add-modal";

const createMatchMock = vi.fn();

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

vi.mock("@admin/admin-match/api/react-query-api/use-create-match", () => ({
  useCreateMatch: () => ({ mutateAsync: createMatchMock, isPending: false }),
}));

describe("AdminMatchAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createMatchMock.mockResolvedValue(undefined);
  });

  it("제목·필드 라벨·버튼을 렌더링한다", () => {
    render(<AdminMatchAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 경기 추가")).toBeInTheDocument();
    expect(screen.getByText("대회 *")).toBeInTheDocument();
    expect(screen.getByText("상대팀 *")).toBeInTheDocument();
    expect(screen.getByText("경기 시작 시간 (한국시간) *")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  it("필수값(대회/상대팀/시작시간)이 비어 있으면 추가 버튼이 비활성화된다", () => {
    render(<AdminMatchAddModal onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "추가" })).toBeDisabled();
  });

  it("취소 클릭 시 생성 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminMatchAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(createMatchMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("경기 시작 시간을 입력하면 경기일 안내 문구가 나타난다", () => {
    const { container } = render(<AdminMatchAddModal onClose={vi.fn()} />);

    const dateInput = container.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    expect(dateInput).not.toBeNull();

    fireEvent.change(dateInput, { target: { value: "2025-11-08T14:30" } });

    expect(screen.getByText(/경기일: 2025-11-08/)).toBeInTheDocument();
  });
});
