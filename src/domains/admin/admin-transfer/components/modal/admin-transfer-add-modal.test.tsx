import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminTransferAddModal } from "@admin/admin-transfer/components/modal/admin-transfer-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-transfer/api/react-query-api/use-create-transfer", () => ({
  useCreateTransfer: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

vi.mock("@admin/admin-player/api/react-query-api/use-get-all-players-suspense", () => ({
  useGetAllPlayersSuspense: () => ({ data: [{ id: "p1", name: "Reus", korean_name: "로이스" }] }),
}));

vi.mock("@admin/admin-team/api/react-query-api/use-get-all-teams-suspense", () => ({
  useGetAllTeamsSuspense: () => ({ data: [{ id: "t2", name: "바이에른 뮌헨" }] }),
}));

describe("AdminTransferAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·주요 필드 라벨·버튼을 렌더링한다", () => {
    render(<AdminTransferAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 이적 추가")).toBeInTheDocument();
    expect(screen.getByText("선수")).toBeInTheDocument();
    expect(screen.getByText("방향")).toBeInTheDocument();
    expect(screen.getByText("유형")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("예: 30000000 (= 30M €)")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  // 버튼을 잠가두면 왜 못 누르는지 알 수 없어, 눌러보면 사유를 알려주는 쪽으로 바꿨다
  it("필수 선택값(선수·방향·유형)이 없으면 등록하지 않고 사유를 보여준다", async () => {
    const onClose = vi.fn();
    render(<AdminTransferAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("선수를 선택해주세요")).toBeInTheDocument();
    expect(screen.getByText("영입/방출을 선택해주세요")).toBeInTheDocument();
    expect(screen.getByText("유형을 선택해주세요")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  describe("은퇴", () => {
    // 콤보박스 순서: 선수 · 방향 · 유형 · 상대 클럽
    const choose = (comboboxIndex: number, optionName: string) => {
      fireEvent.click(screen.getAllByRole("combobox")[comboboxIndex]);
      fireEvent.click(screen.getByRole("option", { name: optionName }));
    };

    it("유형을 은퇴로 고르면 상대 클럽·이적금액 칸을 숨긴다", () => {
      render(<AdminTransferAddModal onClose={vi.fn()} />);

      choose(2, "은퇴");

      expect(screen.getByText("은퇴일")).toBeInTheDocument();
      expect(screen.queryByText("상대 클럽")).not.toBeInTheDocument();
      expect(screen.queryByPlaceholderText("예: 30000000 (= 30M €)")).not.toBeInTheDocument();
    });

    it("은퇴인데 영입을 고르면 등록하지 않고 방출로 고르라고 알린다", async () => {
      render(<AdminTransferAddModal onClose={vi.fn()} />);

      choose(0, "로이스");
      choose(1, "영입");
      choose(2, "은퇴");
      fireEvent.click(screen.getByRole("button", { name: "추가" }));

      expect(await screen.findByText("은퇴는 방출로 선택해주세요")).toBeInTheDocument();
      expect(mutateAsyncMock).not.toHaveBeenCalled();
    });

    it("은퇴 + 방출이면 상대 클럽·이적금액을 비워 등록한다", async () => {
      const onClose = vi.fn();
      render(<AdminTransferAddModal onClose={onClose} />);

      choose(0, "로이스");
      choose(1, "방출");
      // 클럽을 먼저 골라 두었다가 은퇴로 바꿔도 클럽은 보내지 않는다
      choose(3, "바이에른 뮌헨");
      choose(2, "은퇴");
      fireEvent.click(screen.getByRole("button", { name: "추가" }));

      await vi.waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
      expect(mutateAsyncMock).toHaveBeenCalledWith(
        expect.objectContaining({
          direction: "OUT",
          transfer_type: "RETIRED",
          counterpart_team_id: null,
          euro_fee: null,
        }),
      );
    });
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminTransferAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
