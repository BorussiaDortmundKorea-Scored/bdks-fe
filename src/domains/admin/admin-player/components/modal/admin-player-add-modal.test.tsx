import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AdminPlayerAddModal } from "@admin/admin-player/components/modal/admin-player-add-modal";

const mutateAsyncMock = vi.fn();

vi.mock("@admin/admin-player/api/react-query-api/use-create-player", () => ({
  useCreatePlayer: () => ({ mutateAsync: mutateAsyncMock, isPending: false }),
}));

describe("AdminPlayerAddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mutateAsyncMock.mockResolvedValue(undefined);
  });

  it("제목·입력·버튼을 렌더링한다", () => {
    render(<AdminPlayerAddModal onClose={vi.fn()} />);

    expect(screen.getByText("새 선수 추가")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("선수 이름을 입력하세요")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("국적을 입력하세요")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "취소" })).toBeInTheDocument();
  });

  // 버튼을 잠가두면 왜 못 누르는지 알 수 없어, 눌러보면 사유를 알려주는 쪽으로 바꿨다
  it("이름 없이 추가하면 등록하지 않고 입력 밑에 사유를 보여준다", async () => {
    render(<AdminPlayerAddModal onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("선수 이름을 입력해주세요")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("등번호가 범위를 벗어나면 등록하지 않는다", async () => {
    render(<AdminPlayerAddModal onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("선수 이름을 입력하세요"), { target: { value: "Meyer" } });
    fireEvent.change(screen.getByPlaceholderText("등번호를 입력하세요"), { target: { value: "100" } });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    expect(await screen.findByText("등번호는 0~99 사이로 입력해주세요")).toBeInTheDocument();
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("추가 클릭 시 입력값으로 등록하고 모달을 닫는다", async () => {
    const onClose = vi.fn();
    render(<AdminPlayerAddModal onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("선수 이름을 입력하세요"), {
      target: { value: "Meyer" },
    });
    fireEvent.change(screen.getByPlaceholderText("국적을 입력하세요"), {
      target: { value: "독일" },
    });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    await waitFor(() =>
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Meyer",
        korean_name: undefined,
        jersey_number: undefined,
        nationality: "독일",
        full_profile_image_url: undefined,
        head_profile_image_url: undefined,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("취소 클릭 시 등록 없이 모달을 닫는다", () => {
    const onClose = vi.fn();
    render(<AdminPlayerAddModal onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "취소" }));

    expect(mutateAsyncMock).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
